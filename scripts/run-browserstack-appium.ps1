param(
    [string]$ApkPath,
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

function Require-Env {
    param([string]$Name)

    $value = [Environment]::GetEnvironmentVariable($Name)
    if ([string]::IsNullOrWhiteSpace($value)) {
        throw "$Name must be set."
    }

    return $value
}

function Invoke-CheckedCommand {
    param(
        [string]$FilePath,
        [string[]]$Arguments
    )

    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$FilePath $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

$username = Require-Env "BROWSERSTACK_USERNAME"
$accessKey = Require-Env "BROWSERSTACK_ACCESS_KEY"
$existingApp = [Environment]::GetEnvironmentVariable("BROWSERSTACK_APP")

Add-Type -AssemblyName System.Net.Http

if (-not $SkipBuild) {
    Invoke-CheckedCommand "npm" @("run", "android:build")
}

if (-not [string]::IsNullOrWhiteSpace($existingApp)) {
    $env:BROWSERSTACK_ENABLED = "true"
    $env:BROWSERSTACK_APP = $existingApp

    Write-Host "Using existing BrowserStack app $existingApp"
    Invoke-CheckedCommand "dotnet" @("test", "tests/AppiumRegression/AppiumRegression.csproj")
    return
}

if ([string]::IsNullOrWhiteSpace($ApkPath)) {
    $ApkPath = Join-Path $PSScriptRoot "..\platforms\android\app\build\outputs\apk\debug\app-debug.apk"
}

$resolvedApkPath = Resolve-Path $ApkPath -ErrorAction Stop
if (-not (Test-Path $resolvedApkPath -PathType Leaf)) {
    throw "APK not found at $resolvedApkPath."
}

$uploadUri = "https://api-cloud.browserstack.com/app-automate/upload"
$authBytes = [Text.Encoding]::ASCII.GetBytes("${username}:${accessKey}")
$authHeader = "Basic " + [Convert]::ToBase64String($authBytes)

$client = [Net.Http.HttpClient]::new()
$client.DefaultRequestHeaders.Authorization = [Net.Http.Headers.AuthenticationHeaderValue]::Parse($authHeader)
$content = [Net.Http.MultipartFormDataContent]::new()
$fileStream = [IO.File]::OpenRead($resolvedApkPath)

try {
    $fileContent = [Net.Http.StreamContent]::new($fileStream)
    $fileContent.Headers.ContentType = [Net.Http.Headers.MediaTypeHeaderValue]::Parse("application/vnd.android.package-archive")
    $content.Add($fileContent, "file", [IO.Path]::GetFileName($resolvedApkPath))

    $customId = [Environment]::GetEnvironmentVariable("BROWSERSTACK_CUSTOM_ID")
    if (-not [string]::IsNullOrWhiteSpace($customId)) {
        $content.Add([Net.Http.StringContent]::new($customId), "custom_id")
    }

    $response = $client.PostAsync($uploadUri, $content).GetAwaiter().GetResult()
    $body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()

    if (-not $response.IsSuccessStatusCode) {
        throw "BrowserStack upload failed with HTTP $([int]$response.StatusCode): $body"
    }

    $upload = $body | ConvertFrom-Json
    if ([string]::IsNullOrWhiteSpace($upload.app_url)) {
        throw "BrowserStack upload response did not include app_url: $body"
    }

    $env:BROWSERSTACK_ENABLED = "true"
    $env:BROWSERSTACK_APP = $upload.app_url

    Write-Host "Uploaded APK to BrowserStack as $($upload.app_url)"
    Invoke-CheckedCommand "dotnet" @("test", "tests/AppiumRegression/AppiumRegression.csproj")
}
finally {
    if ($fileStream) {
        $fileStream.Dispose()
    }

    $content.Dispose()
    $client.Dispose()
}
