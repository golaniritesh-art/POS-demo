using OpenQA.Selenium;
using OpenQA.Selenium.Appium;
using OpenQA.Selenium.Appium.Android;
using OpenQA.Selenium.Support.UI;
using NUnit.Framework;

namespace AppiumRegression;

[TestFixture]
public class PosRegressionTests
{
    private AndroidDriver? _driver;

    private AndroidDriver Driver => _driver ?? throw new InvalidOperationException("Driver is not initialized.");

    [SetUp]
    public void SetUp()
    {
        var runOnBrowserStack = IsTruthy(Setting("BROWSERSTACK_ENABLED"));
        var options = runOnBrowserStack ? BrowserStackOptions() : LocalOptions();
        var serverUrl = runOnBrowserStack
            ? "https://hub-cloud.browserstack.com/wd/hub"
            : Setting("APPIUM_SERVER_URL") ?? "http://127.0.0.1:4723";

        _driver = new AndroidDriver(new Uri(serverUrl), options, TimeSpan.FromMinutes(3));
        _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(2);
        _driver.StartActivity("org.nativescript.retailpos", "com.tns.NativeScriptActivity");
    }

    private static AppiumOptions LocalOptions()
    {
        var apkPath = Setting("POS_APK") ?? DefaultApkPath();
        Assert.That(File.Exists(apkPath), Is.True, $"APK not found at {apkPath}. Build it first with: npm run android:build");

        var options = new AppiumOptions
        {
            PlatformName = "Android",
            AutomationName = "UiAutomator2",
            DeviceName = Setting("APPIUM_DEVICE_NAME") ?? "emulator-5554",
            App = apkPath
        };

        options.AddAdditionalAppiumOption("appPackage", "org.nativescript.retailpos");
        options.AddAdditionalAppiumOption("appActivity", "com.tns.NativeScriptActivity");
        options.AddAdditionalAppiumOption("autoGrantPermissions", true);
        options.AddAdditionalAppiumOption("noReset", false);
        options.AddAdditionalAppiumOption("newCommandTimeout", 120);

        return options;
    }

    private static AppiumOptions BrowserStackOptions()
    {
        var username = RequiredEnv("BROWSERSTACK_USERNAME");
        var accessKey = RequiredEnv("BROWSERSTACK_ACCESS_KEY");
        var app = RequiredEnv("BROWSERSTACK_APP");

        var options = new AppiumOptions
        {
            PlatformName = "Android",
            AutomationName = "UiAutomator2",
            DeviceName = Setting("BROWSERSTACK_DEVICE_NAME") ?? "Samsung Galaxy S23"
        };

        options.App = app;
        options.AddAdditionalAppiumOption("platformVersion", Setting("BROWSERSTACK_OS_VERSION") ?? "13.0");
        options.AddAdditionalAppiumOption("appPackage", "org.nativescript.retailpos");
        options.AddAdditionalAppiumOption("appActivity", "com.tns.NativeScriptActivity");
        options.AddAdditionalAppiumOption("autoGrantPermissions", true);
        options.AddAdditionalAppiumOption("noReset", false);
        options.AddAdditionalAppiumOption("newCommandTimeout", 120);

        var browserStackOptions = new Dictionary<string, object>
        {
            ["userName"] = username,
            ["accessKey"] = accessKey,
            ["projectName"] = Setting("BROWSERSTACK_PROJECT_NAME") ?? "Retail POS",
            ["buildName"] = Setting("BROWSERSTACK_BUILD_NAME") ?? $"local-{DateTime.UtcNow:yyyyMMdd-HHmmss}",
            ["sessionName"] = TestContext.CurrentContext.Test.Name,
            ["debug"] = "true",
            ["networkLogs"] = "true",
            ["deviceLogs"] = "true",
            ["appiumLogs"] = "true"
        };

        options.AddAdditionalOption("bstack:options", browserStackOptions);
        return options;
    }

    [TearDown]
    public void TearDown()
    {
        _driver?.Quit();
        _driver?.Dispose();
        _driver = null;
    }

    [Test]
    public void LaunchesToAnEmptyPosCart()
    {
        Assert.That(TextByAccessibilityId("pos-screen-title"), Is.EqualTo("Quick sale"));
        Assert.That(TextByAccessibilityId("cart-count"), Is.EqualTo("Empty cart"));
        Assert.That(TextByAccessibilityId("header-total"), Is.EqualTo("Total: $0.00"));
        Assert.That(TextByAccessibilityId("cart-empty"), Is.EqualTo("No items added"));
    }

    [Test]
    public void AddsRunningShoeAndCalculatesCartTotals()
    {
        TapByAccessibilityId("product-add-p1");

        Assert.That(TextByAccessibilityId("cart-count"), Is.EqualTo("1 item"));
        Assert.That(TextByAccessibilityId("cart-item-name-v1"), Is.EqualTo("Running Shoe"));
        Assert.That(TextByAccessibilityId("cart-item-detail-v1"), Is.EqualTo("8 Black Qty: 1"));
        Assert.That(TextByAccessibilityId("cart-subtotal"), Is.EqualTo("Subtotal: $89.99"));
        Assert.That(TextByAccessibilityId("cart-tax"), Is.EqualTo("Tax: $7.20"));
        Assert.That(TextByAccessibilityId("cart-total"), Is.EqualTo("Total: $97.19"));
    }

    [Test]
    public void CompletesDemoCardCheckoutAndClearsCart()
    {
        TapByAccessibilityId("product-add-p1");
        TapByAccessibilityId("checkout-button");

        Assert.That(TextByAccessibilityId("payment-title"), Is.EqualTo("Charge $97.19"));
        SetTextByAccessibilityId("payment-card-input", "4242 4242 4242 4242");
        TapByAccessibilityId("payment-submit-button");

        WaitForAccessibilityId("message-text");
        Assert.That(TextByAccessibilityId("message-text"), Does.Contain("Sale completed. Approved **** 4242."));
        TapByAccessibilityId("message-ok-button");

        Assert.That(TextByAccessibilityId("cart-count"), Is.EqualTo("Empty cart"));
        Assert.That(TextByAccessibilityId("header-total"), Is.EqualTo("Total: $0.00"));
    }

    [Test]
    public void BlocksAddingMoreSize8RunningShoesThanCurrentStock()
    {
        for (var i = 0; i < 6; i++)
        {
            TapByAccessibilityId("product-add-p1");
        }

        WaitForAccessibilityId("message-text");
        Assert.That(TextByAccessibilityId("message-text"), Does.Contain("Only 5 Running Shoe"));
        TapByAccessibilityId("message-ok-button");

        Assert.That(TextByAccessibilityId("cart-item-detail-v1"), Is.EqualTo("8 Black Qty: 5"));
    }

    private static string DefaultApkPath()
    {
        return Path.GetFullPath(Path.Combine(
            TestContext.CurrentContext.TestDirectory,
            "..",
            "..",
            "..",
            "..",
            "..",
            "platforms",
            "android",
            "app",
            "build",
            "outputs",
            "apk",
            "debug",
            "app-debug.apk"));
    }

    private static bool IsTruthy(string? value)
    {
        return value is not null && new[] { "1", "true", "yes", "on" }.Contains(value.Trim(), StringComparer.OrdinalIgnoreCase);
    }

    private static string RequiredEnv(string name)
    {
        var value = Setting(name);
        Assert.That(value, Is.Not.Null.And.Not.Empty, $"{name} must be set when BROWSERSTACK_ENABLED=true.");
        return value!;
    }

    private static string? Setting(string name)
    {
        return Environment.GetEnvironmentVariable(name) ?? TestContext.Parameters.Get(name);
    }

    private IWebElement ElementByAccessibilityId(string accessibilityId)
    {
        return WaitUntil(_ => Driver.FindElement(MobileBy.AccessibilityId(accessibilityId)));
    }

    private string TextByAccessibilityId(string accessibilityId)
    {
        return ElementByAccessibilityId(accessibilityId).Text.Trim();
    }

    private void TapByAccessibilityId(string accessibilityId)
    {
        ElementByAccessibilityId(accessibilityId).Click();
    }

    private void SetTextByAccessibilityId(string accessibilityId, string text)
    {
        var element = ElementByAccessibilityId(accessibilityId);
        element.Clear();
        element.SendKeys(text);
    }

    private void WaitForAccessibilityId(string accessibilityId)
    {
        ElementByAccessibilityId(accessibilityId);
    }

    private T WaitUntil<T>(Func<IWebDriver, T> condition)
    {
        var wait = new WebDriverWait(Driver, TimeSpan.FromSeconds(15))
        {
            PollingInterval = TimeSpan.FromMilliseconds(250)
        };

        wait.IgnoreExceptionTypes(typeof(NoSuchElementException), typeof(StaleElementReferenceException));
        return wait.Until(condition);
    }
}
