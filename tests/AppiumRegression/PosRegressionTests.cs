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
        options.AddAdditionalAppiumOption("appWaitPackage", "org.nativescript.retailpos");
        options.AddAdditionalAppiumOption("appWaitActivity", "com.tns.NativeScriptActivity");
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
            DeviceName = Setting("BROWSERSTACK_DEVICE_NAME") ?? "Samsung Galaxy S25",
            PlatformVersion = Setting("BROWSERSTACK_OS_VERSION") ?? "15.0"
        };

        options.App = app;
        options.AddAdditionalAppiumOption("appPackage", "org.nativescript.retailpos");
        options.AddAdditionalAppiumOption("appActivity", "com.tns.NativeScriptActivity");
        options.AddAdditionalAppiumOption("appWaitPackage", "org.nativescript.retailpos");
        options.AddAdditionalAppiumOption("appWaitActivity", "com.tns.NativeScriptActivity");
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

        options.AddAdditionalAppiumOption("bstack:options", browserStackOptions);
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
    [Category("Smoke")]
    public void LaunchesToAnEmptyPosCart()
    {
        Assert.That(TextByAccessibilityId("pos-screen-title"), Is.EqualTo("Quick sale"));
        Assert.That(TextByAccessibilityId("cart-count"), Is.EqualTo("Empty cart"));
        Assert.That(TextByAccessibilityId("header-total"), Is.EqualTo("Total: $0.00"));
        Assert.That(TextByAccessibilityId("cart-empty"), Is.EqualTo("No items added"));
    }

    [Test]
    [Category("Smoke")]
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
    public void ProductCardsExposeStableAutomationTargets()
    {
        Assert.That(TextByAccessibilityId("product-name-p1"), Is.EqualTo("Running Shoe"));
        Assert.That(TextByAccessibilityId("product-meta-p1"), Is.EqualTo("shoes / running"));
        Assert.That(TextByAccessibilityId("product-price-p1"), Is.EqualTo("$89.99"));
        Assert.That(TextByAccessibilityId("product-graphic-text-p1"), Is.EqualTo("SHOE"));
        Assert.That(ElementByAccessibilityId("product-add-p1").Displayed, Is.True);
    }

    [Test]
    public void FiltersCatalogByCategoryUsingStableTargets()
    {
        TapByAccessibilityId("filter-boots");

        Assert.That(TextByAccessibilityId("product-name-p6"), Is.EqualTo("Hiking Boot"));
        Assert.That(TextByAccessibilityId("product-meta-p6"), Is.EqualTo("boots / hiking"));
        Assert.That(TextByAccessibilityId("product-price-p6"), Is.EqualTo("$119.99"));

        TapByAccessibilityId("filter-accessories");

        Assert.That(TextByAccessibilityId("product-name-p16"), Is.EqualTo("Crew Socks"));
        Assert.That(TextByAccessibilityId("product-meta-p16"), Is.EqualTo("accessories / socks"));
        Assert.That(TextByAccessibilityId("product-price-p16"), Is.EqualTo("$9.99"));
    }

    [Test]
    public void AddingSameVariantTwiceIncrementsQuantityAndTotals()
    {
        TapByAccessibilityId("product-add-p1");
        TapByAccessibilityId("product-add-p1");

        Assert.That(TextByAccessibilityId("cart-count"), Is.EqualTo("2 items"));
        Assert.That(TextByAccessibilityId("cart-item-name-v1"), Is.EqualTo("Running Shoe"));
        Assert.That(TextByAccessibilityId("cart-item-detail-v1"), Is.EqualTo("8 Black Qty: 2"));
        Assert.That(TextByAccessibilityId("cart-item-price-v1"), Is.EqualTo("$179.98"));
        Assert.That(TextByAccessibilityId("cart-subtotal"), Is.EqualTo("Subtotal: $179.98"));
        Assert.That(TextByAccessibilityId("cart-tax"), Is.EqualTo("Tax: $14.40"));
        Assert.That(TextByAccessibilityId("cart-total"), Is.EqualTo("Total: $194.38"));
    }

    [Test]
    public void AddsAccessoryWithSingleVariantDirectlyToCart()
    {
        TapByAccessibilityId("filter-accessories");
        TapByAccessibilityId("product-add-p16");

        Assert.That(TextByAccessibilityId("cart-count"), Is.EqualTo("1 item"));
        Assert.That(TextByAccessibilityId("cart-item-name-v19"), Is.EqualTo("Crew Socks"));
        Assert.That(TextByAccessibilityId("cart-item-detail-v19"), Is.EqualTo("OS Black Qty: 1"));
        Assert.That(TextByAccessibilityId("cart-subtotal"), Is.EqualTo("Subtotal: $9.99"));
        Assert.That(TextByAccessibilityId("cart-tax"), Is.EqualTo("Tax: $0.80"));
        Assert.That(TextByAccessibilityId("cart-total"), Is.EqualTo("Total: $10.79"));
    }

    [Test]
    [Category("Smoke")]
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
    public void DeclinedDemoCardShowsErrorAndKeepsCartForRetry()
    {
        TapByAccessibilityId("product-add-p1");
        TapByAccessibilityId("checkout-button");
        SetTextByAccessibilityId("payment-card-input", "4000000000000002");
        TapByAccessibilityId("payment-submit-button");

        WaitForAccessibilityId("message-text");

        Assert.That(TextByAccessibilityId("message-text"), Is.EqualTo("Demo card declined."));
        Assert.That(TextByAccessibilityId("cart-count"), Is.EqualTo("1 item"));
        Assert.That(TextByAccessibilityId("cart-item-detail-v1"), Is.EqualTo("8 Black Qty: 1"));
        Assert.That(TextByAccessibilityId("cart-total"), Is.EqualTo("Total: $97.19"));
        Assert.That(TextByAccessibilityId("payment-title"), Is.EqualTo("Charge $97.19"));
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
        return WaitUntil(_ =>
        {
            try
            {
                return Driver.FindElement(MobileBy.AndroidUIAutomator($"new UiSelector().resourceId(\"{accessibilityId}\")"));
            }
            catch (NoSuchElementException)
            {
                return Driver.FindElement(MobileBy.AccessibilityId(accessibilityId));
            }
        });
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
