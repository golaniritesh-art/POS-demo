# UX Guide - Retail POS App

## UX Objective
The POS app must allow a cashier to complete a sale quickly with minimal taps.

Primary UX goals:
- Fast checkout
- Simple layout
- Large touch targets
- Always-visible cart
- Clear size/color variant handling
- Tablet-friendly landscape layout
- Appium-testable controls

## Target Device
Primary target:
- Tablet
- Landscape orientation

Development/testing:
- Android emulator
- BrowserStack for iPad/iOS testing later

## Main Layout
Recommended POS screen layout:

Left side:
- Category tabs
- Subcategory filters
- Product list/grid

Right side:
- Cart panel
- Subtotal
- Tax
- Total
- Checkout button

Wireframe:

--------------------------------------------------
| Categories                                     |
--------------------------------------------------
| Subcategories                                  |
--------------------------------------------------
| Product Catalog             | Cart             |
| Product cards/list          | Cart items       |
|                             | Subtotal         |
|                             | Tax              |
|                             | Total            |
|                             | Checkout         |
--------------------------------------------------

## Category Navigation
Top category tabs:
- All
- Shoes
- Boots
- T-Shirts
- Accessories

Behavior:
- Tap category.
- Product list updates.
- Subcategory row updates.
- Previous subcategory resets.

Appium IDs:
- category-all
- category-shoes
- category-boots
- category-tshirts
- category-accessories

## Subcategory Navigation
Subcategory row changes by selected category.

Shoes selected:
- Running
- Walking
- Jogging
- Sports
- Casual

Boots selected:
- Work
- Hiking
- Winter
- Dress
- Ankle
- Rain

T-Shirts selected:
- Basic
- Graphic
- Sports
- Oversized

Accessories selected:
- Socks
- Insoles
- Laces
- Shoe Care
- Bags

Behavior:
- Tap subcategory.
- Product list filters instantly.

Example Appium IDs:
- subcategory-running
- subcategory-hiking
- subcategory-basic
- subcategory-shoe-care

## Product List / Product Card
Each product card should show:
- Product name
- Category / subcategory
- Price
- Add button

Example:

Running Shoe
Shoes / Running
$89.99
[Add]

Future product card may show:
- Image
- Stock indicator
- Available sizes
- Available colors

UX rule:
Do not clutter product card with too much detail.

## Variant Picker UX
Variant picker is required for real POS behavior.

Current Phase 1:
- First variant is auto-selected.

Next phase:
When product has multiple variants:
1. Open modal.
2. User selects size.
3. User selects color.
4. User taps Add to Cart.

Variant picker layout:

Select Size
[8] [9] [10] [11]

Select Color
[Black] [White] [Brown]

[Add to Cart]

UX rule:
- Add to Cart button disabled until valid variant is selected.
- Out-of-stock variants should be disabled later.

Appium IDs:
- variant-size-8
- variant-size-9
- variant-color-black
- variant-color-brown
- add-to-cart-button

## Cart Panel UX
Cart must always be visible on tablet layout.

Cart item should show:
- Product name
- Size/color
- Quantity
- Line total

Example:

Running Shoe
Size: 9 Black
Qty: 1
$89.99

Cart summary:
- Subtotal
- Tax
- Total

Checkout button should be large and clear.

Appium IDs:
- cart-total
- checkout-button

## Checkout UX
Phase 1 checkout flow:
1. User taps Checkout.
2. If cart empty, show alert.
3. If cart has items, show sale completed alert.
4. Clear cart.

Future checkout flow:
1. Tap Checkout.
2. Show payment method screen.
3. Select Cash or Card.
4. Complete sale.
5. Show success message.
6. Clear cart.

## Payment UX Future
Payment screen options:
- Cash
- Card
- Cancel

Cash screen:
- Total due
- Amount received
- Change due
- Complete Sale

Card mock:
- Total due
- Process Card button
- Success/failure response

Appium IDs:
- payment-cash-button
- payment-card-button
- amount-received-input
- complete-sale-button
- sale-complete-message

## Empty States
Product list empty:

Message:
No products found

Cart empty:
Show cart title and zero totals.

Do not hide cart panel.

## Error Messages
Errors should be simple and cashier-friendly.

Examples:
- Cart is empty
- No variant available
- Please select size and color
- Product not found
- Payment amount is not enough

## Touch Target Guidelines
Buttons should be large enough for fast retail use.

Recommended:
- Minimum button height: 44-48 dp
- Product card spacing: comfortable
- Avoid tiny icons without labels
- Keep checkout button visually prominent

## Color and Style Direction
Recommended style:
- Light background
- White cards
- Dark checkout button
- Clear typography
- Minimal visual clutter

Current Phase 1 CSS:
- Page background: light gray
- Product cards: white
- Cart panel: white
- Checkout button: dark

## UX Rules
Rule 1:
Cashier should add a product in three taps or fewer after category is selected.

Rule 2:
Cart must always show current sale state.

Rule 3:
Variant details must be visible in cart.

Rule 4:
Checkout must be blocked when cart is empty.

Rule 5:
Do not require internet for normal checkout.

Rule 6:
Use stable automationText for all Appium test targets.

## Manual Test Checklist
Phase 1 manual testing:
1. Launch app.
2. Confirm category row visible.
3. Confirm product list visible.
4. Tap Shoes.
5. Tap Running.
6. Confirm Running Shoe visible.
7. Tap Add.
8. Confirm cart updates.
9. Tap Add again.
10. Confirm quantity increases.
11. Tap Checkout.
12. Confirm sale completed alert.
13. Confirm cart clears.

## Known Phase 1 Limitations
- No variant picker yet.
- No SQLite persistence yet.
- No real payment integration.
- No cloud sync.
- No stock enforcement.
- No receipt printing.
- No barcode scanning.

## Recommended Next UX Improvements
1. Variant picker modal.
2. Payment screen.
3. Product search.
4. Cart item remove/decrease quantity.
5. SQLite persistence.
6. Barcode scan workflow.
