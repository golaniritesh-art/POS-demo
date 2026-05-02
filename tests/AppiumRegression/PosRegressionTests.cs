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
        var apkPath = Environment.GetEnvironmentVariable("POS_APK") ?? DefaultApkPath();

        Assert.That(File.Exists(apkPath), Is.True, $"APK not found at {apkPath}. Build it first with: npm run android:build");

        var options = new AppiumOptions
        {
            PlatformName = "Android",
            AutomationName = "UiAutomator2",
            DeviceName = Environment.GetEnvironmentVariable("APPIUM_DEVICE_NAME") ?? "emulator-5554",
            App = apkPath
        };

        options.AddAdditionalAppiumOption("appPackage", "org.nativescript.retailpos");
        options.AddAdditionalAppiumOption("appActivity", "com.tns.NativeScriptActivity");
        options.AddAdditionalAppiumOption("autoGrantPermissions", true);
        options.AddAdditionalAppiumOption("noReset", false);
        options.AddAdditionalAppiumOption("newCommandTimeout", 120);

        var serverUrl = Environment.GetEnvironmentVariable("APPIUM_SERVER_URL") ?? "http://127.0.0.1:4723";
        _driver = new AndroidDriver(new Uri(serverUrl), options, TimeSpan.FromMinutes(3));
        _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(2);
        _driver.StartActivity("org.nativescript.retailpos", "com.tns.NativeScriptActivity");
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
        TapText("PAY");

        WaitForTextContains("Sale completed. Approved **** 4242.");
        TapText("OK");

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

        WaitForTextContains("Only 5 Running Shoe");
        TapText("OK");

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

    private void TapText(string text)
    {
        WaitUntil(_ => Driver.FindElement(MobileBy.AndroidUIAutomator($"new UiSelector().text(\"{text}\")"))).Click();
    }

    private void WaitForTextContains(string text)
    {
        WaitUntil(_ => Driver.FindElement(MobileBy.AndroidUIAutomator($"new UiSelector().textContains(\"{text}\")")));
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
