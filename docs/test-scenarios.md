# Retail POS Functional Test Scenarios

Generated from `domain-knowledge`, `business-logic.md`, and `POS_UX_GUIDE.md`.

### TC-001: Launch POS Screen
**Category**: Happy Path
**Priority**: P0
**Preconditions**: App is installed and local product catalog is available.
**Steps**: 1. Open the app. 2. Wait for the POS screen to load.
**Expected Results**: Category tabs, product catalog, always-visible cart panel, totals, and checkout button are displayed.
**Business Rule**: Phase 1 is complete when the app launches successfully and the product list is visible.
**Suggested Layer**: E2E

### TC-002: View All Products By Default
**Category**: Happy Path
**Priority**: P0
**Preconditions**: App is on the POS screen.
**Steps**: 1. Observe the selected category. 2. Review the product catalog.
**Expected Results**: `All` is available and products from supported categories can be shown.
**Business Rule**: Product is visible when selectedCategory is `all` or product.category matches selectedCategory.
**Suggested Layer**: E2E

### TC-003: Filter Shoes Category
**Category**: Happy Path
**Priority**: P0
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-shoes`. 2. Review the product catalog and subcategory row.
**Expected Results**: Shoe products are visible and shoe subcategories are displayed.
**Business Rule**: When selected category changes, set selectedCategory, reset selectedSubCategory to `all`, and refresh product list.
**Suggested Layer**: E2E

### TC-004: Filter Boots Category
**Category**: Happy Path
**Priority**: P1
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-boots`. 2. Review the product catalog and subcategory row.
**Expected Results**: Boot products are visible and boot subcategories are displayed.
**Business Rule**: Only show subcategories for the selected category.
**Suggested Layer**: E2E

### TC-005: Filter T-Shirts Category
**Category**: Happy Path
**Priority**: P1
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-tshirts`. 2. Review the product catalog and subcategory row.
**Expected Results**: T-shirt products are visible and t-shirt subcategories are displayed.
**Business Rule**: Supported Phase 1 categories include `tshirts`.
**Suggested Layer**: E2E

### TC-006: Filter Accessories Category
**Category**: Happy Path
**Priority**: P1
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-accessories`. 2. Review the product catalog and subcategory row.
**Expected Results**: Accessory products are visible and accessory subcategories are displayed.
**Business Rule**: Supported Phase 1 categories include `accessories`.
**Suggested Layer**: E2E

### TC-007: Filter Shoes By Running Subcategory
**Category**: Happy Path
**Priority**: P0
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-shoes`. 2. Tap `subcategory-running`.
**Expected Results**: Only products where category is shoes and subCategory is running are visible.
**Business Rule**: Visible products must match both category and subcategory filters.
**Suggested Layer**: E2E

### TC-008: Filter Boots By Hiking Subcategory
**Category**: Happy Path
**Priority**: P1
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-boots`. 2. Tap `subcategory-hiking`.
**Expected Results**: Only hiking boot products are visible.
**Business Rule**: Product filtering uses categoryMatch AND subCategoryMatch.
**Suggested Layer**: E2E

### TC-009: Add Product To Cart
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Product catalog contains a product with at least one variant.
**Steps**: 1. Select a product. 2. Tap its add button.
**Expected Results**: A cart line appears with product name, variant details, quantity, price, and updated totals.
**Business Rule**: If a product has one variant, add the variant directly.
**Suggested Layer**: E2E

### TC-010: Add Accessory With Single Variant
**Category**: Happy Path
**Priority**: P1
**Preconditions**: Accessory product has only one variant and no size/color requirement.
**Steps**: 1. Tap `category-accessories`. 2. Select an accessory. 3. Tap add.
**Expected Results**: Accessory is added directly to cart without variant picker.
**Business Rule**: Accessory may be added directly if it has only one variant and no size/color requirement.
**Suggested Layer**: E2E

### TC-011: Complete Phase 1 Checkout
**Category**: Happy Path
**Priority**: P0
**Preconditions**: Cart contains at least one item.
**Steps**: 1. Tap `checkout-button`. 2. Accept the sale completed alert.
**Expected Results**: Success alert is shown and cart is cleared.
**Business Rule**: Phase 1 checkout creates an order later, shows success, and clears cart.
**Suggested Layer**: E2E

### TC-012: Cashier Three-Tap Add Flow
**Category**: Happy Path
**Priority**: P2
**Preconditions**: Category is already selected and matching products are visible.
**Steps**: 1. Tap subcategory. 2. Tap product add action. 3. Review cart.
**Expected Results**: Cashier can add a visible product in three taps or fewer after category selection.
**Business Rule**: Cashier should add a product in three taps or fewer after category is selected.
**Suggested Layer**: E2E

### TC-100: Category Change Resets Subcategory
**Category**: Business Rule
**Priority**: P0
**Preconditions**: Shoes category and running subcategory are selected.
**Steps**: 1. Tap `category-boots`. 2. Inspect active subcategory and product list.
**Expected Results**: Selected subcategory resets to `all`; boot products are visible without carrying the running filter.
**Business Rule**: When selected category changes, reset selectedSubCategory to `all`.
**Suggested Layer**: Component

### TC-101: Shoes Subcategories Are Dynamic
**Category**: Business Rule
**Priority**: P1
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-shoes`. 2. Inspect subcategory options.
**Expected Results**: Running, Walking, Jogging, Sports, and Casual are shown; non-shoe subcategories are not shown.
**Business Rule**: Only show subcategories for the selected category.
**Suggested Layer**: Component

### TC-102: Boots Subcategories Are Dynamic
**Category**: Business Rule
**Priority**: P1
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-boots`. 2. Inspect subcategory options.
**Expected Results**: Work, Hiking, Winter, Dress, Ankle, and Rain are shown; non-boot subcategories are not shown.
**Business Rule**: Subcategories are dynamic based on selected category.
**Suggested Layer**: Component

### TC-103: T-Shirt Subcategories Are Dynamic
**Category**: Business Rule
**Priority**: P2
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-tshirts`. 2. Inspect subcategory options.
**Expected Results**: Basic, Graphic, Sports, and Oversized are shown.
**Business Rule**: T-Shirts subcategories are basic, graphic, sports, and oversized.
**Suggested Layer**: Component

### TC-104: Accessories Subcategories Are Dynamic
**Category**: Business Rule
**Priority**: P2
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-accessories`. 2. Inspect subcategory options.
**Expected Results**: Socks, Insoles, Laces, Shoe Care, and Bags are shown.
**Business Rule**: Accessories subcategories are socks, insoles, laces, shoe-care, and bags.
**Suggested Layer**: Component

### TC-105: Product Filtering Requires Category And Subcategory Match
**Category**: Business Rule
**Priority**: P0
**Preconditions**: Category and subcategory filters are available.
**Steps**: 1. Select shoes. 2. Select running. 3. Inspect visible products.
**Expected Results**: No product outside shoes/running is visible.
**Business Rule**: Visible equals categoryMatch AND subCategoryMatch.
**Suggested Layer**: Unit

### TC-106: Same Variant Added Twice Increments Quantity
**Category**: Business Rule
**Priority**: P0
**Preconditions**: A product with a sellable variant is visible.
**Steps**: 1. Add the product. 2. Add the same product variant again.
**Expected Results**: Cart keeps one line and quantity increases to 2.
**Business Rule**: If same variantId exists, increase quantity on repeated add.
**Suggested Layer**: E2E

### TC-107: Different Variants Create Separate Cart Lines
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Variant picker behavior is available or cart store can add two variants of the same product.
**Steps**: 1. Add Running Shoe size 8 black. 2. Add Running Shoe size 9 black.
**Expected Results**: Cart shows two separate lines with distinct SKU/variant details.
**Business Rule**: Different size or variant must create separate cart lines.
**Suggested Layer**: Unit

### TC-108: Cart Totals Use Subtotal Tax And Total Formula
**Category**: Business Rule
**Priority**: P0
**Preconditions**: Cart contains items with known prices and quantities.
**Steps**: 1. Add one or more items. 2. Inspect subtotal, tax, and total.
**Expected Results**: subtotal = sum(price * qty), tax = subtotal * 0.08, total = subtotal + tax.
**Business Rule**: Current tax rate is 0.08.
**Suggested Layer**: Unit

### TC-109: Checkout Requires Non-Empty Cart
**Category**: Business Rule
**Priority**: P0
**Preconditions**: Cart is empty.
**Steps**: 1. Tap `checkout-button`.
**Expected Results**: Checkout does not complete and `Cart is empty` is shown.
**Business Rule**: Checkout is allowed only when cart has at least one item.
**Suggested Layer**: E2E

### TC-110: Checkout Clears Cart After Success
**Category**: Business Rule
**Priority**: P0
**Preconditions**: Cart contains at least one item.
**Steps**: 1. Tap checkout. 2. Dismiss success alert.
**Expected Results**: Cart lines are removed and subtotal, tax, and total return to zero.
**Business Rule**: Phase 1 checkout shows success alert and clears cart.
**Suggested Layer**: E2E

### TC-111: Product With Multiple Variants Requires Picker
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Next-phase variant picker is implemented and a product has more than one variant.
**Steps**: 1. Tap add on a multi-variant product.
**Expected Results**: Variant picker opens instead of silently adding a variant.
**Business Rule**: If product.variants.length > 1, open variant picker.
**Suggested Layer**: Component

### TC-112: Variant Picker Requires Size And Color
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Next-phase variant picker is open for a size/color product.
**Steps**: 1. Select size only. 2. Try to add. 3. Select color. 4. Add to cart.
**Expected Results**: Add is disabled or blocked until a valid size/color combination is selected.
**Business Rule**: Add to Cart button disabled until valid variant is selected.
**Suggested Layer**: Component

### TC-113: Sales Are Recorded Against SKU Variant
**Category**: Business Rule
**Priority**: P1
**Preconditions**: Cart contains a variant-based product.
**Steps**: 1. Add variant to cart. 2. Complete checkout or inspect order creation payload.
**Expected Results**: Cart/order item contains variantId and SKU, not only productId.
**Business Rule**: Sales should be recorded against variant/SKU, not only product.
**Suggested Layer**: API

### TC-114: SKU Is Unique Per Variant
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Product catalog data is loaded.
**Steps**: 1. Inspect all variants in the catalog. 2. Compare SKU values.
**Expected Results**: No duplicate SKU exists across variants.
**Business Rule**: SKU must be unique per variant.
**Suggested Layer**: Unit

### TC-115: Barcode Maps To Exact Variant
**Category**: Business Rule
**Priority**: P3
**Preconditions**: Future barcode scan workflow is implemented.
**Steps**: 1. Scan a barcode mapped to a known variant.
**Expected Results**: The exact matching variant is added or selected.
**Business Rule**: Future barcode scan should find exact variant.
**Suggested Layer**: API

### TC-116: Stock Is Variant Level
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Catalog includes stock on variants.
**Steps**: 1. Inspect footwear and apparel variants. 2. Compare stock placement.
**Expected Results**: Stock is represented per variant, not only at product level.
**Business Rule**: Variant-level stock is required for shoes, boots, and t-shirts.
**Suggested Layer**: Unit

### TC-117: Future Stock Enforcement Blocks Oversell
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Future stock enforcement is implemented and a variant has limited stock.
**Steps**: 1. Add quantity greater than available stock. 2. Attempt checkout.
**Expected Results**: Sale is blocked with stock unavailable message.
**Business Rule**: Before sale completion, ensure variant.stock >= qty.
**Suggested Layer**: API

### TC-118: Future Stock Deducts After Successful Checkout
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Future stock enforcement is implemented.
**Steps**: 1. Record starting stock. 2. Complete checkout for one unit. 3. Inspect stock.
**Expected Results**: Variant stock decreases by sold quantity after successful checkout.
**Business Rule**: Stock deduction is variant.stock = variant.stock - qty.
**Suggested Layer**: API

### TC-119: Future Cash Payment Calculates Change
**Category**: Business Rule
**Priority**: P2
**Preconditions**: Future payment screen is implemented and cart has total due.
**Steps**: 1. Select Cash. 2. Enter amount received greater than total. 3. Complete sale.
**Expected Results**: Change equals amountReceived - total and sale can complete.
**Business Rule**: Cash future logic calculates change from amount received minus total.
**Suggested Layer**: Component

### TC-120: Future Local Orders Are Marked Unsynced
**Category**: Business Rule
**Priority**: P3
**Preconditions**: Future SQLite persistence is implemented.
**Steps**: 1. Complete a sale offline. 2. Inspect saved order.
**Expected Results**: Order is saved locally with synced = false.
**Business Rule**: Future SQLite logic saves orders locally and marks unsynced orders as synced = false.
**Suggested Layer**: API

### TC-200: Do Not Store Card Numbers
**Category**: Security
**Priority**: P0
**Preconditions**: Payment flow or payment data model exists.
**Steps**: 1. Search payment UI and persisted order data for card number fields. 2. Complete mock card flow if available.
**Expected Results**: No card number or sensitive card data is accepted, stored, logged, or persisted.
**Business Rule**: Real card payments must use provider SDK/terminal and never store card numbers.
**Suggested Layer**: API

### TC-201: Mock Card Payment Does Not Request Sensitive Data
**Category**: Security
**Priority**: P1
**Preconditions**: Future card mock screen is implemented.
**Steps**: 1. Select Card. 2. Inspect required inputs.
**Expected Results**: Card mock flow simulates success/failure without asking for PAN, CVV, or expiration date.
**Business Rule**: Phase 1 payment is mock/manual; real card data must not be handled directly.
**Suggested Layer**: E2E

### TC-202: Automation IDs Are Stable
**Category**: Security
**Priority**: P2
**Preconditions**: App UI is rendered.
**Steps**: 1. Locate key controls by automationText. 2. Change visual text where supported or inspect IDs separately from labels.
**Expected Results**: Test targets such as `category-shoes`, `checkout-button`, and `cart-total` remain stable regardless of visual text.
**Business Rule**: Automation IDs should not change based on visual text changes.
**Suggested Layer**: Component

### TC-203: Checkout Cannot Be Completed By Direct Empty-State Action
**Category**: Security
**Priority**: P0
**Preconditions**: Cart is empty.
**Steps**: 1. Invoke checkout through the UI. 2. If store/API action is test-accessible, call checkout with empty cart.
**Expected Results**: Both UI and underlying action reject checkout.
**Business Rule**: Checkout must be blocked when cart is empty.
**Suggested Layer**: Unit

### TC-204: Invalid Product Id Cannot Be Added
**Category**: Security
**Priority**: P1
**Preconditions**: Cart store or product service can be called in a test.
**Steps**: 1. Attempt to add a product id that does not exist.
**Expected Results**: No cart line is created and a cashier-friendly product not found error is returned or shown.
**Business Rule**: Show user-friendly error when product not found.
**Suggested Layer**: Unit

### TC-205: Variant Id Must Belong To Selected Product
**Category**: Security
**Priority**: P1
**Preconditions**: Variant picker or cart store accepts product and variant inputs.
**Steps**: 1. Attempt to add product A with variant id from product B.
**Expected Results**: Add is rejected and no mismatched cart line is created.
**Business Rule**: A variant represents the exact sellable item for its product.
**Suggested Layer**: Unit

### TC-206: Offline Checkout Does Not Require Internet
**Category**: Security
**Priority**: P1
**Preconditions**: App is launched with catalog already available.
**Steps**: 1. Disable network. 2. Add item. 3. Complete Phase 1 checkout.
**Expected Results**: Normal checkout flow works without internet.
**Business Rule**: Retail POS must continue working if internet is unavailable.
**Suggested Layer**: E2E

### TC-207: Future Multi-POS Conflict Requires Backend Validation
**Category**: Security
**Priority**: P3
**Preconditions**: Future sync service/backend exists.
**Steps**: 1. Simulate two POS devices selling the last unit. 2. Sync both orders.
**Expected Results**: Backend validates stock and resolves final state instead of blindly accepting both stock deductions.
**Business Rule**: Backend must decide final state for multi-POS stock conflicts.
**Suggested Layer**: API

### TC-300: Empty Cart Checkout Shows Error
**Category**: Negative
**Priority**: P0
**Preconditions**: Cart is empty.
**Steps**: 1. Tap `checkout-button`.
**Expected Results**: `Cart is empty` is shown; cart remains empty; no success message appears.
**Business Rule**: If cart is empty, show `Cart is empty` and do not continue.
**Suggested Layer**: E2E

### TC-301: Product With No Variant Is Blocked
**Category**: Negative
**Priority**: P1
**Preconditions**: Catalog contains or test injects a product with no variants.
**Steps**: 1. Attempt to add the product.
**Expected Results**: Add is blocked and `No variant available` or equivalent friendly message is shown.
**Business Rule**: If product has no variant, block add.
**Suggested Layer**: Unit

### TC-302: Variant Not Selected Is Blocked
**Category**: Negative
**Priority**: P1
**Preconditions**: Future variant picker is open for a multi-variant product.
**Steps**: 1. Do not select size/color. 2. Attempt to add to cart.
**Expected Results**: Add is disabled or `Please select size and color` is shown.
**Business Rule**: Show user-friendly error when variant not selected.
**Suggested Layer**: Component

### TC-303: Unknown Subcategory Produces No Incorrect Products
**Category**: Negative
**Priority**: P2
**Preconditions**: Product filtering function can be tested with arbitrary selectedSubCategory.
**Steps**: 1. Set selected category to shoes. 2. Set selected subcategory to an unsupported value.
**Expected Results**: No unrelated products are shown; app does not crash.
**Business Rule**: Visible products must match selectedSubCategory or selectedSubCategory must be `all`.
**Suggested Layer**: Unit

### TC-304: Future Cash Payment Blocks Insufficient Amount
**Category**: Negative
**Priority**: P2
**Preconditions**: Future payment screen is implemented and cart has total due.
**Steps**: 1. Select Cash. 2. Enter amount received less than total. 3. Tap Complete Sale.
**Expected Results**: Sale is blocked with `Payment amount is not enough`.
**Business Rule**: If amountReceived < total, block completion.
**Suggested Layer**: Component

### TC-305: Future Out-Of-Stock Variant Is Disabled
**Category**: Negative
**Priority**: P2
**Preconditions**: Future variant picker includes stock state and a variant has stock 0.
**Steps**: 1. Open variant picker. 2. Attempt to select out-of-stock variant.
**Expected Results**: Out-of-stock variant is disabled and cannot be added.
**Business Rule**: Out-of-stock variants should be disabled later.
**Suggested Layer**: Component

### TC-306: Error Messages Hide Technical Details
**Category**: Negative
**Priority**: P1
**Preconditions**: Error paths can be triggered.
**Steps**: 1. Trigger product not found, no variant, and empty cart errors. 2. Inspect displayed messages.
**Expected Results**: Cashier sees simple messages with no stack traces, exception names, or internal identifiers.
**Business Rule**: Do not show technical stack traces to cashier.
**Suggested Layer**: E2E

### TC-307: Checkout Failure Does Not Clear Cart
**Category**: Negative
**Priority**: P1
**Preconditions**: Cart contains at least one item and a checkout error can be simulated.
**Steps**: 1. Trigger checkout failure before sale completion.
**Expected Results**: Cart contents and totals remain available for retry.
**Business Rule**: Cart clears after successful checkout; errors should be user-friendly.
**Suggested Layer**: Unit

### TC-400: Zero-Price Or Decimal Price Totals Remain Correct
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Cart calculation can be tested with controlled item prices.
**Steps**: 1. Add item priced at 0.00 or a decimal value. 2. Calculate totals.
**Expected Results**: Totals are mathematically correct and formatted as currency.
**Business Rule**: subtotal = sum(item.price * item.qty), tax = subtotal * TAX_RATE, total = subtotal + tax.
**Suggested Layer**: Unit

### TC-401: Tax Rounding Is Consistent
**Category**: Edge Case
**Priority**: P1
**Preconditions**: Cart calculation can be tested with prices that produce fractional cents.
**Steps**: 1. Add items whose subtotal * 0.08 creates more than two decimals. 2. Inspect displayed totals.
**Expected Results**: Tax and total display consistently to currency precision.
**Business Rule**: Tax rate is 0.08 and totals must update correctly.
**Suggested Layer**: Unit

### TC-402: Large Quantity Repeated Adds Preserve One Cart Line
**Category**: Edge Case
**Priority**: P2
**Preconditions**: A product variant is visible.
**Steps**: 1. Add the same variant many times.
**Expected Results**: Quantity increments accurately and the cart does not create duplicate lines for the same variant.
**Business Rule**: If same variantId exists, increase quantity on repeated add.
**Suggested Layer**: Unit

### TC-403: Empty Product Filter Shows Empty State
**Category**: Edge Case
**Priority**: P2
**Preconditions**: A category/subcategory combination or test data produces no matching products.
**Steps**: 1. Apply the empty filter combination.
**Expected Results**: Product list shows `No products found` and cart remains visible.
**Business Rule**: Product list empty state message is `No products found`; do not hide cart panel.
**Suggested Layer**: Component

### TC-404: All Category With Subcategory All Shows Complete Catalog
**Category**: Edge Case
**Priority**: P1
**Preconditions**: App is on the POS screen.
**Steps**: 1. Tap `category-all`. 2. Ensure selected subcategory is `all`.
**Expected Results**: Products are not excluded by category or subcategory.
**Business Rule**: selectedCategory `all` and selectedSubCategory `all` match all products.
**Suggested Layer**: Unit

### TC-405: Long Product Names Do Not Break Product Cards
**Category**: Edge Case
**Priority**: P3
**Preconditions**: Catalog includes or test injects a product with a long name.
**Steps**: 1. Render product card.
**Expected Results**: Name is readable without overlapping price, category, or add action.
**Business Rule**: Product card should show name, category/subcategory, price, and Add without clutter.
**Suggested Layer**: Component

### TC-406: Variant Details With Missing Size Or Color Remain Readable
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Product variant has only size, only color, or neither because it is an accessory.
**Steps**: 1. Add the variant to cart. 2. Inspect cart line.
**Expected Results**: Cart line remains readable and does not display misleading undefined/null text.
**Business Rule**: Variant details must be visible in cart; accessory without size/color may be added directly.
**Suggested Layer**: Component

### TC-407: App Handles Offline Launch With In-Memory Phase 1 Limits
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Phase 1 app is launched without network.
**Steps**: 1. Disable network. 2. Launch app. 3. Complete a local sale.
**Expected Results**: In-memory catalog and checkout flow operate without network dependency.
**Business Rule**: Phase 1 uses in-memory data and normal checkout should not require internet.
**Suggested Layer**: E2E

### TC-408: Future Unsynced Orders Sync When Online
**Category**: Edge Case
**Priority**: P3
**Preconditions**: Future SQLite and sync process are implemented with unsynced local orders.
**Steps**: 1. Complete order offline. 2. Restore network. 3. Trigger sync.
**Expected Results**: Unsynced order is sent to backend and marked synced after success.
**Business Rule**: Sync unsynced orders when online.
**Suggested Layer**: API

### TC-500: Cart Empty State Shows Zero Totals
**Category**: UI State
**Priority**: P0
**Preconditions**: Cart is empty.
**Steps**: 1. Inspect cart panel.
**Expected Results**: Cart title/panel remains visible and subtotal, tax, and total show zero.
**Business Rule**: Cart empty state should show cart title and zero totals; do not hide cart panel.
**Suggested Layer**: E2E

### TC-501: Cart Shows Current Sale State After Add
**Category**: UI State
**Priority**: P0
**Preconditions**: Product catalog contains addable product.
**Steps**: 1. Add a product. 2. Inspect cart panel.
**Expected Results**: Cart immediately shows item, quantity, line total, subtotal, tax, and total.
**Business Rule**: Cart must always show current sale state.
**Suggested Layer**: E2E

### TC-502: Variant Details Are Visible In Cart
**Category**: UI State
**Priority**: P0
**Preconditions**: Cart contains footwear or apparel variant.
**Steps**: 1. Add variant-based product. 2. Inspect cart item.
**Expected Results**: Size/color or SKU-identifying variant details are visible.
**Business Rule**: Variant details must be visible in cart.
**Suggested Layer**: E2E

### TC-503: Product Card Displays Required Fields
**Category**: UI State
**Priority**: P1
**Preconditions**: Product catalog is visible.
**Steps**: 1. Inspect a product card.
**Expected Results**: Product name, category/subcategory, price, and Add button are displayed.
**Business Rule**: Each product card should show product name, category/subcategory, price, and Add button.
**Suggested Layer**: Component

### TC-504: Checkout Button Is Large And Prominent
**Category**: UI State
**Priority**: P2
**Preconditions**: App is on tablet landscape layout.
**Steps**: 1. Inspect checkout button dimensions and visibility.
**Expected Results**: Checkout button is easy to tap and remains visually prominent in cart panel.
**Business Rule**: Checkout button should be large and clear; recommended button height is 44-48 dp.
**Suggested Layer**: Component

### TC-505: Tablet Landscape Keeps Cart Always Visible
**Category**: UI State
**Priority**: P0
**Preconditions**: App is running on tablet landscape viewport.
**Steps**: 1. Navigate categories and subcategories. 2. Scroll product catalog if needed.
**Expected Results**: Cart panel remains visible on the right side.
**Business Rule**: Cart must always be visible on tablet layout.
**Suggested Layer**: E2E

### TC-506: Category Automation Targets Exist
**Category**: UI State
**Priority**: P0
**Preconditions**: App is on POS screen.
**Steps**: 1. Locate `category-all`, `category-shoes`, `category-boots`, `category-tshirts`, and `category-accessories`.
**Expected Results**: All category controls are discoverable by stable automationText.
**Business Rule**: Every key UI action must have stable automationText.
**Suggested Layer**: E2E

### TC-507: Core Cart Automation Targets Exist
**Category**: UI State
**Priority**: P0
**Preconditions**: App is on POS screen.
**Steps**: 1. Locate `cart-total` and `checkout-button`.
**Expected Results**: Cart total and checkout controls are discoverable by stable automationText.
**Business Rule**: Automation IDs should not change based on visual text changes.
**Suggested Layer**: E2E

### TC-508: Future Payment Automation Targets Exist
**Category**: UI State
**Priority**: P3
**Preconditions**: Future payment screen is implemented.
**Steps**: 1. Navigate to payment screen. 2. Locate cash, card, amount received, complete sale, and sale complete controls.
**Expected Results**: `payment-cash-button`, `payment-card-button`, `amount-received-input`, `complete-sale-button`, and `sale-complete-message` exist.
**Business Rule**: Payment UX future Appium IDs are defined for payment controls.
**Suggested Layer**: E2E

### TC-509: Sale Completed Message Appears On Successful Checkout
**Category**: UI State
**Priority**: P0
**Preconditions**: Cart contains at least one item.
**Steps**: 1. Tap checkout.
**Expected Results**: Sale completed alert/message appears before or as cart clears.
**Business Rule**: Phase 1 checkout shows sale completed alert.
**Suggested Layer**: E2E

### TC-510: Product List Updates Instantly On Subcategory Tap
**Category**: UI State
**Priority**: P1
**Preconditions**: Category with multiple subcategories is selected.
**Steps**: 1. Tap one subcategory. 2. Tap another subcategory.
**Expected Results**: Product list updates promptly to match each selected subcategory.
**Business Rule**: Tap subcategory filters product list instantly.
**Suggested Layer**: E2E

