# 🛒 Shoe Store POS Automation Project

A **mobile Point-of-Sale (POS) demo application** built using **NativeScript (Android)** with a strong focus on **end-to-end test automation using Appium (C#)**.

This project demonstrates real-world **retail transaction workflows**, including inventory management, cart operations, checkout, and backend validation concepts.

## Automation integrations

### BrowserStack integration ready

BrowserStack App Automate integration is implemented for Android Appium tests. The project can build and upload the debug APK automatically, or reuse an existing `bs://` app ID. Device, OS, project, and build metadata are configurable through environment variables, while credentials are supplied through GitHub Actions secrets or local environment variables.

```powershell
$env:BROWSERSTACK_USERNAME = "your_username"
$env:BROWSERSTACK_ACCESS_KEY = "your_access_key"
$env:BROWSERSTACK_APP = "bs://your_uploaded_app_id"
npm run test:browserstack
```

See [BrowserStack Appium testing](docs/browserstack-testing.md) for local, uploaded-app, and GitHub Actions configuration.

### Robot Framework integration

Robot Framework runs alongside the existing C# NUnit Appium suite. It uses the same stable NativeScript resource IDs and supports both connected Android devices and BrowserStack.

Install its isolated Python environment once:

```powershell
.\scripts\run-robot-appium.ps1 -InstallDependencies -InstallOnly
```

Run the Robot Framework smoke suite on a connected Android device:

```powershell
npm run test:robot:smoke
```

Run the same suite on BrowserStack:

```powershell
.\scripts\run-robot-appium.ps1 -UseBrowserStack -Include smoke
```

The smoke suite covers application launch, cart totals, and approved demo-card checkout.

---

## 🔥 Key Highlights

- 📱 Automated **end-to-end POS workflows** (Inventory → Cart → Checkout → Payment)
- ⚙️ Built scalable **mobile automation framework using Appium (C#)**
- 🗄️ Integrated **SQLite database** for inventory and sales tracking
- ☁️ Executed tests on **local Android devices and BrowserStack cloud devices**
- 🎯 Designed to simulate **real-world e-commerce / payment systems**

---

## 🚀 Features

### 👟 Inventory Management
- Display product catalog (shoe items)
- Track stock using SQLite database

### 🛍️ Cart & Checkout
- Add/remove items dynamically
- Validate cart totals and quantities
- Simulate checkout and payment flow

### 💳 Payment Flow
- End-to-end transaction simulation
- Order confirmation and validation

---

## 🧪 Test Automation Framework

| Component | Details |
|----------|--------|
| Framework | Appium with NUnit and Robot Framework |
| Language | C# and Robot Framework/Python |
| Platform | Android |
| Execution | Local + BrowserStack |
| Test Type | UI + End-to-End |

---

## 🔁 End-to-End Test Flow

1. Launch application  
2. Navigate inventory  
3. Add products to cart  
4. Validate cart items and totals  
5. Perform checkout  
6. Complete payment  
7. Validate success message  

👉 Covers full **business-critical transaction workflow**

---

## 🧱 Tech Stack

- **Frontend:** NativeScript (Android)
- **Automation:** Appium + C# NUnit + Robot Framework
- **Database:** SQLite
- **Cloud Testing:** BrowserStack
- **CI/CD:** GitHub Actions and Azure Pipelines

---

## 📊 Execution Summary

- ✅ Successfully executed tests on:
  - Local Android device
  - BrowserStack cloud devices  
- ⚡ Demonstrated **cross-device test stability**

---

## 📌 Pending Enhancements

- 🤖 **Self-Healing Automation**
  - AI-based locator recovery for flaky tests  
  - Improve test resilience in CI/CD  

---

## 🎯 Why This Project Matters

This project showcases:

- Real-world **POS/e-commerce testing scenarios**
- Strong understanding of **end-to-end system validation**
- Ability to integrate:
  - UI automation
  - Database validation concepts
  - Cloud execution environments

---


## 🚀 Future Scope

- API validation integration  
- Database validation using ADO.NET  
- Advanced reporting (Allure/Extent)  
- Parallel execution setup  

---

## 📢 Summary

A **production-like QA automation project** demonstrating:

✔ Mobile automation (Appium + C#)  
✔ End-to-end transaction validation  
✔ Cloud execution (BrowserStack)  
✔ Real-world retail system simulation  

---

<img width="1080" height="2340" alt="Screenshot_20260505_124324_retailpos" src="https://github.com/user-attachments/assets/4e575ce2-a4d5-4646-8a0c-bdcc2ff3144e" />
