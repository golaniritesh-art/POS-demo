import os
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def _setting(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def _required(name: str) -> str:
    value = _setting(name)
    if not value:
        raise RuntimeError(f"{name} must be set when BROWSERSTACK_ENABLED=true.")
    return value


def _truthy(value: str) -> bool:
    return value.lower() in {"1", "true", "yes", "on"}


def get_variables() -> dict:
    browserstack = _truthy(_setting("BROWSERSTACK_ENABLED"))

    if browserstack:
        capabilities = {
            "platformName": "Android",
            "appium:automationName": "UiAutomator2",
            "appium:app": _required("BROWSERSTACK_APP"),
            "bstack:options": {
                "userName": _required("BROWSERSTACK_USERNAME"),
                "accessKey": _required("BROWSERSTACK_ACCESS_KEY"),
                "deviceName": _setting("BROWSERSTACK_DEVICE_NAME", "Samsung Galaxy S25"),
                "osVersion": _setting("BROWSERSTACK_OS_VERSION", "15.0"),
                "projectName": _setting("BROWSERSTACK_PROJECT_NAME", "Retail POS"),
                "buildName": _setting("BROWSERSTACK_BUILD_NAME", "Retail POS Robot Framework"),
                "sessionName": _setting("BROWSERSTACK_SESSION_NAME", "Robot Framework POS tests"),
                "debug": True,
                "networkLogs": True,
                "deviceLogs": True,
                "appiumLogs": True,
            },
        }
        remote_url = "https://hub.browserstack.com/wd/hub"
    else:
        apk = _setting(
            "ROBOT_APP_PATH",
            str(
                ROOT
                / "platforms"
                / "android"
                / "app"
                / "build"
                / "outputs"
                / "apk"
                / "debug"
                / "app-debug.apk"
            ),
        )
        capabilities = {
            "platformName": "Android",
            "appium:automationName": "UiAutomator2",
            "appium:app": str(Path(apk).resolve()),
            "appium:autoGrantPermissions": True,
            "appium:noReset": False,
            "appium:newCommandTimeout": 120,
        }
        remote_url = _setting("APPIUM_SERVER_URL", "http://127.0.0.1:4723")

    return {
        "REMOTE_URL": remote_url,
        "CAPABILITIES": capabilities,
        "BROWSERSTACK_ENABLED": browserstack,
    }
