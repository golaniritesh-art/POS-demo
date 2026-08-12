*** Settings ***
Documentation       Robot Framework smoke coverage for the Retail POS Android app.
Resource            ../resources/pos.resource
Variables           ../variables.py
Test Setup          Open Retail POS
Test Teardown       Close Retail POS

*** Test Cases ***
Launches To An Empty POS Cart
    [Tags]    smoke    launch
    POS Should Have An Empty Cart

Adds Running Shoe And Calculates Cart Totals
    [Tags]    smoke    cart
    Add Running Shoe To Cart
    Running Shoe Totals Should Be Correct

Completes Demo Card Checkout And Clears Cart
    [Tags]    smoke    checkout
    Add Running Shoe To Cart
    Complete Checkout With Approved Demo Card
    Sale Completion Should Be Displayed
