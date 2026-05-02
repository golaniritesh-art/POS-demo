---
name: domain-knowledge
description: POS application domain knowledge — business rules, API endpoints, data models, user flows, UI selectors, and error scenarios. Use when writing tests, reviewing code, creating scenarios, or answering questions about how EventHub works.
user-invocable: false
---

# Domain Knowledge - Retail POS App

## App Context
This app is a tablet-focused retail POS system for a store selling shoes, boots, t-shirts, and accessories.

The app is built with:
- NativeScript
- TypeScript
- MobX
- NativeScript XML/CSS
- SQLite planned for offline persistence
- Appium C# planned for automation testing

## Product Domain

### Product
A product is a sellable item displayed in the POS catalog.

Examples:
- Running Shoe
- Hiking Boot
- Basic T-Shirt
- Cleaning Kit

### Product Category
Products are grouped into top-level categories.

Supported Phase 1 categories:
- shoes
- boots
- tshirts
- accessories

### Product Subcategory
Subcategories help cashiers quickly find items.

Shoes:
- running
- walking
- jogging
- sports
- casual

Boots:
- work
- hiking
- winter
- dress
- ankle
- rain

T-Shirts:
- basic
- graphic
- sports
- oversized

Accessories:
- socks
- insoles
- laces
- shoe-care
- bags

## Variant-Based Retail
Footwear and apparel are variant-based products.

A product may have many sellable variants based on:
- Size
- Color
- SKU
- Barcode
- Stock quantity

Example:

Running Shoe:
- Size 8, Black, SKU RUN-BLK-8
- Size 9, Black, SKU RUN-BLK-9

Each variant is treated as a separate sellable inventory unit.

## SKU
SKU means Stock Keeping Unit.

A SKU identifies one exact sellable variant.

Example:

RUN-BLK-9

Meaning:
- Running shoe
- Black
- Size 9

Business rule:
- SKU must be unique per variant.
- Sales should be recorded against variant/SKU, not only product.

## Barcode
Barcode is used for scanning items into the POS.

Phase 1:
- Barcode is stored in data model.
- Scanner integration is not implemented yet.

Future:
- Barcode scan should find exact variant.
- If barcode maps to a variant, item can be added directly.

## Inventory
Inventory should eventually be tracked per variant.

Example:

Running Shoe:
- Size 8 Black: 5 units
- Size 9 Black: 4 units

Important:
- Product-level stock is not accurate enough.
- Variant-level stock is required for shoes, boots, and t-shirts.

## Offline-First POS
A retail POS must continue working if internet is unavailable.

Phase 1:
- Data is in memory.
- SQLite is planned.

Future:
- Products, variants, cart drafts, orders, and unsynced transactions should be stored locally.
- Sync to cloud should happen when network is available.

## Multi-POS Reality
SQLite alone is enough for one local POS device.

For multiple POS terminals, the system needs:
- Local SQLite per device
- Backend API
- Central database
- Sync process
- Conflict handling

Correct architecture:

POS App + SQLite
→ Sync Service
→ Cloud API
→ Central Database

SQLite is the local offline engine.
Backend database is the global source of truth.

## Payment Domain
Phase 1 supports mock/manual payments only:
- Cash
- Card mock

Real card payments should not be implemented by directly handling card data.

Future real payments require:
- Payment provider SDK
- External terminal
- No storage of card numbers
- Secure payment status response

## Typical Cashier Flow
1. Open POS screen
2. Select product category
3. Select subcategory
4. Select product
5. Select size/color variant if required
6. Add to cart
7. Review cart
8. Checkout
9. Select payment method
10. Complete sale

## Important Retail Scenarios

### Same Variant Added Twice
If the same product variant is added again, increase quantity.

### Different Size Added
If same product but different size is added, create separate cart line.

### Accessory Without Variant
Accessory may be added directly if it has only one variant and no size/color requirement.

### Empty Cart Checkout
Checkout must be blocked.

### Product With No Variant
Adding should be blocked with a user-friendly message.

## Future Domain Areas
- Returns
- Exchanges
- Refunds
- Customer profile
- Loyalty
- Discounts
- Employee login
- Manager approval
- Receipt printing
- Barcode scanner
- Payment terminal
- Cloud sync
- Inventory reports
