# Business Logic - Retail POS App

## Purpose
This document defines the main business rules and implementation logic for the retail POS app.

The app is for a footwear/apparel store selling shoes, boots, t-shirts, and accessories.

## Phase 1 Scope
Phase 1 includes:
- Local product catalog
- Category filters
- Subcategory filters
- Cart
- Basic checkout
- Mock checkout completion
- Appium-friendly automation IDs

Phase 1 excludes:
- SQLite persistence
- Real payments
- Cloud sync
- Multi-POS inventory
- Barcode scanning
- Returns/refunds

## Core Entities

### Product
A product represents a general item type.

Fields:
- id
- name
- category
- subCategory
- price
- variants

### ProductVariant
A variant represents the exact sellable item.

Fields:
- id
- sku
- barcode
- size
- color
- stock

### CartItem
A cart item represents a selected product variant in the current sale.

Fields:
- productId
- variantId
- name
- sku
- size
- color
- qty
- price

### Order
An order represents a completed sale.

Planned fields:
- id
- items
- subtotal
- tax
- total
- paymentMethod
- createdAt
- synced

## Category Logic
Top-level category filter values:
- all
- shoes
- boots
- tshirts
- accessories

Business rule:

When selected category changes:
1. Set selectedCategory.
2. Reset selectedSubCategory to all.
3. Refresh product list.

## Subcategory Logic
Subcategories are dynamic based on selected category.

Business rule:

Only show subcategories for the selected category.

Example:

If selectedCategory = shoes:
- running
- walking
- jogging
- sports
- casual

If selectedCategory = boots:
- work
- hiking
- winter
- dress
- ankle
- rain

Do not show all subcategories globally.

## Product Filtering Logic
A product is visible when:
- selectedCategory is all OR product.category matches selectedCategory
- selectedSubCategory is all OR product.subCategory matches selectedSubCategory

Pseudo logic:

categoryMatch =
  selectedCategory == "all" OR product.category == selectedCategory

subCategoryMatch =
  selectedSubCategory == "all" OR product.subCategory == selectedSubCategory

visible =
  categoryMatch AND subCategoryMatch

## Add to Cart Logic
When adding product to cart:
1. Determine selected variant.
2. If product has no variant, block add.
3. If same variant already exists in cart, increase qty.
4. Else add new cart line.

Current Phase 1 behavior:
- App adds first variant automatically.

Required next phase:
- Open variant picker before adding products with size/color variants.

## Variant Selection Logic
Products with multiple variants require cashier selection.

Business rule:

If product.variants.length > 1:
  open variant picker

Else:
  add only variant directly

Future rule:

If variant has size/color:
  require explicit selection

## Cart Calculation Logic
subtotal = sum(item.price * item.qty)

tax = subtotal * TAX_RATE

total = subtotal + tax

Current tax rate:
0.08

Tax rate should later move to config.

## Cart Quantity Logic
If same variantId exists:
- Increase quantity on repeated add.

If different variantId:
- Add separate line.

Example:
Running Shoe Size 8 and Running Shoe Size 9 are two separate cart lines.

## Checkout Logic
Checkout is allowed only when cart has at least one item.

If cart is empty:
- Show "Cart is empty"
- Do not continue

If cart has items:
1. Calculate total.
2. Create order object.
3. Save order later.
4. Clear cart.
5. Show success message.

Phase 1:
- Order is not persisted.
- Success alert is shown.
- Cart is cleared.

## Payment Logic
Phase 1 payment is mock/manual.

Supported methods:
- cash
- card

Cash future logic:
- User enters amount received.
- Change = amountReceived - total.
- If amountReceived < total, block completion.

Card future logic:
- Simulate success in demo.
- Real integration later must use payment SDK/provider.

Security rule:
Never store card numbers or sensitive payment data.

## Stock Logic
Phase 1:
- Stock is displayed in data model.
- Stock is not enforced.

Future:
Before sale completion:
- Ensure variant.stock >= qty.
- Block sale if insufficient stock.
- Deduct stock after successful checkout.

Stock deduction:
variant.stock = variant.stock - qty

For multi-POS:
- Stock deduction must be confirmed by backend sync process.

## Offline Logic
Phase 1:
- In-memory stores only.

Future SQLite logic:
- Load products from SQLite on app start.
- Save orders locally.
- Mark orders as synced = false.
- Sync unsynced orders when online.

## Sync Logic Future
For multi-POS:
1. POS saves order locally.
2. POS sends order to backend.
3. Backend validates stock.
4. Backend records order.
5. Backend updates central stock.
6. POS pulls latest stock.

Conflict example:
Two POS devices sell the last size 9 shoe.

Backend must decide final state.

## Error Handling Rules
Show user-friendly error when:
- Cart is empty
- Product has no variant
- Variant not selected
- Product not found
- Payment amount insufficient
- Stock unavailable

Do not show technical stack traces to cashier.

## Appium Test ID Rules
Every key UI action must have stable automationText.

Examples:
- category-all
- category-shoes
- category-boots
- category-tshirts
- category-accessories
- subcategory-running
- subcategory-hiking
- product-p1
- add-to-cart-button
- cart-total
- checkout-button
- payment-cash-button
- payment-card-button
- complete-sale-button

Automation IDs should not change based on visual text changes.

## Phase 1 Success Criteria
Phase 1 is complete when:
- App launches successfully.
- Category buttons work.
- Subcategory filters work.
- Product list is visible.
- Add button adds item to cart.
- Adding same item increases quantity.
- Totals update correctly.
- Checkout clears cart.
- Appium-friendly IDs exist.
