param(
    [string]$ApkPath,
    [string]$Include,
    [switch]$SkipBuild,
    [switch]$InstallDependencies,
    [switch]$InstallOnly,
    [switch]$UseBrowserStack
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path $PSScriptRoot -Parent
$robotRoot = Join-Path $repoRoot "tests\RobotFramework"
$resultsPath = Join-Path $repoRoot "robot-results"
$venvPath = Join-Path $repoRoot ".venv-robot"
$pythonPath = Join-Path $venvPath "Scripts\python.exe"
$appiumProcess = $null

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

function Test-Truthy {
    param([string]$Value)
    return $Value -match '^(?i:1|true|yes|on)$'
}

if ($InstallDependencies) {
    if (-not (Test-Path $pythonPath)) {
        Invoke-CheckedCommand "python" @("-m", "venv", $venvPath)
    }

    Invoke-CheckedCommand $pythonPath @("-m", "pip", "install", "--upgrade", "pip")
    Invoke-CheckedCommand $pythonPath @("-m", "pip", "install", "-r", (Join-Path $robotRoot "requirements.txt"))
}

if ($InstallOnly) {
    if (-not $InstallDependencies) {
        throw "-InstallOnly must be used with -InstallDependencies."
    }

    Write-Host "Robot Framework dependencies are installed in $venvPath"
    return
}

if (-not (Test-Path $pythonPath)) {
    throw "Robot environment not found. Run this script once with -InstallDependencies."
}

$browserStackEnabled = $UseBrowserStack -or (Test-Truthy $env:BROWSERSTACK_ENABLED)
$env:BROWSERSTACK_ENABLED = if ($browserStackEnabled) { "true" } else { "false" }

if (-not $browserStackEnabled) {
    if (-not $SkipBuild) {
        Invoke-CheckedCommand "npm.cmd" @("run", "android:build")
    }

    if ([string]::IsNullOrWhiteSpace($ApkPath)) {
        $ApkPath = Join-Path $repoRoot "platforms\android\app\build\outputs\apk\debug\app-debug.apk"
    }

    $resolvedApk = Resolve-Path $ApkPath -ErrorAction Stop
    $env:ROBOT_APP_PATH = $resolvedApk.Path

    $appiumCommand = Get-Command "appium.cmd" -ErrorAction SilentlyContinue
    if (-not $appiumCommand) {
        throw "Appium is not installed. Install Appium 2 and the UiAutomator2 driver before running local tests."
    }

    $appiumLog = Join-Path $resultsPath "appium.log"
    New-Item -ItemType Directory -Force -Path $resultsPath | Out-Null
    $appiumProcess = Start-Process `
        -FilePath $appiumCommand.Source `
        -ArgumentList @("--base-path", "/", "--log", $appiumLog) `
        -PassThru `
        -WindowStyle Hidden

    $ready = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        try {
            Invoke-RestMethod -Uri "http://127.0.0.1:4723/status" -TimeoutSec 2 | Out-Null
            $ready = $true
            break
        } catch {
            Start-Sleep -Seconds 1
        }
    }

    if (-not $ready) {
        throw "Appium did not become ready at http://127.0.0.1:4723/status."
    }
}

try {
    $arguments = @(
        "-m", "robot",
        "--outputdir", $resultsPath
    )

    if (-not [string]::IsNullOrWhiteSpace($Include)) {
        $arguments += @("--include", $Include)
    }

    $arguments += (Join-Path $robotRoot "suites")
    Invoke-CheckedCommand $pythonPath $arguments
}
finally {
    if ($appiumProcess -and -not $appiumProcess.HasExited) {
        Stop-Process -Id $appiumProcess.Id -Force
    }
}
