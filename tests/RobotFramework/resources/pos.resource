*** Settings ***
Library    AppiumLibrary    timeout=15s    run_on_failure=Capture Page Screenshot

*** Variables ***
${POS_TITLE}              android=new UiSelector().resourceId("pos-screen-title")
${CART_COUNT}             android=new UiSelector().resourceId("cart-count")
${HEADER_TOTAL}           android=new UiSelector().resourceId("header-total")
${EMPTY_CART}             android=new UiSelector().resourceId("cart-empty")
${RUNNING_SHOE_ADD}       android=new UiSelector().resourceId("product-add-p1")
${RUNNING_SHOE_NAME}      android=new UiSelector().resourceId("cart-item-name-v1")
${RUNNING_SHOE_DETAIL}    android=new UiSelector().resourceId("cart-item-detail-v1")
${CART_SUBTOTAL}          android=new UiSelector().resourceId("cart-subtotal")
${CART_TAX}               android=new UiSelector().resourceId("cart-tax")
${CART_TOTAL}             android=new UiSelector().resourceId("cart-total")
${CHECKOUT_BUTTON}        android=new UiSelector().resourceId("checkout-button")
${PAYMENT_TITLE}          android=new UiSelector().resourceId("payment-title")
${PAYMENT_CARD_INPUT}     android=new UiSelector().resourceId("payment-card-input")
${PAYMENT_SUBMIT}         android=new UiSelector().resourceId("payment-submit-button")
${MESSAGE_TEXT}           android=new UiSelector().resourceId("message-text")

*** Keywords ***
Open Retail POS
    Open Application    ${REMOTE_URL}    &{CAPABILITIES}
    Wait Until Page Contains Element    ${POS_TITLE}

Close Retail POS
    Close All Applications

POS Should Have An Empty Cart
    Element Text Should Be    ${POS_TITLE}       Quick sale
    Element Text Should Be    ${CART_COUNT}      Empty cart
    Element Text Should Be    ${HEADER_TOTAL}    Total: $0.00
    Element Text Should Be    ${EMPTY_CART}      No items added

Add Running Shoe To Cart
    Click Element    ${RUNNING_SHOE_ADD}
    Wait Until Element Is Visible    ${RUNNING_SHOE_NAME}

Running Shoe Totals Should Be Correct
    Element Text Should Be    ${CART_COUNT}             1 item
    Element Text Should Be    ${RUNNING_SHOE_NAME}      Running Shoe
    Element Text Should Be    ${RUNNING_SHOE_DETAIL}    8 Black Qty: 1
    Element Text Should Be    ${CART_SUBTOTAL}          Subtotal: $89.99
    Element Text Should Be    ${CART_TAX}               Tax: $7.20
    Element Text Should Be    ${CART_TOTAL}             Total: $97.19

Complete Checkout With Approved Demo Card
    Click Element    ${CHECKOUT_BUTTON}
    Wait Until Element Is Visible    ${PAYMENT_TITLE}
    Element Text Should Be    ${PAYMENT_TITLE}    Charge $97.19
    Clear Text    ${PAYMENT_CARD_INPUT}
    Input Text    ${PAYMENT_CARD_INPUT}    4242 4242 4242 4242
    Click Element    ${PAYMENT_SUBMIT}
    Wait Until Element Is Visible    ${MESSAGE_TEXT}

Sale Completion Should Be Displayed
    Element Should Contain Text    ${MESSAGE_TEXT}    Sale completed. Approved **** 4242.
    Element Text Should Be         ${CART_COUNT}      Empty cart
    Element Text Should Be         ${HEADER_TOTAL}    Total: $0.00
