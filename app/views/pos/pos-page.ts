import { EventData, Page, Observable, alert } from "@nativescript/core";
import { productStore } from "../../stores/ProductStore";
import { filterStore } from "../../stores/FilterStore";
import { cartStore } from "../../stores/CartStore";
import { Product } from "../../models/Product";

let vm: Observable;

export function onLoaded(args: EventData) {
  const page = args.object as Page;
  vm = new Observable();
  vm.set("messageText", "");
  vm.set("messageVisible", visibility(false));
  vm.set("paymentCardNumber", "");
  vm.set("paymentTitleText", "");
  vm.set("paymentVisible", visibility(false));
  page.bindingContext = vm;
  refresh();
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function visibility(value: boolean) {
  return value ? "visible" : "collapsed";
}

function graphicText(category: Product["category"]) {
  switch (category) {
    case "shoes":
      return "SHOE";
    case "boots":
      return "BOOT";
    case "tshirts":
      return "TEE";
    case "accessories":
      return "ACC";
  }
}

function normalizeCardNumber(value: string) {
  return value.replace(/\D/g, "");
}

function maskCardNumber(cardNumber: string) {
  return `**** ${cardNumber.slice(-4)}`;
}

function passesLuhn(cardNumber: string) {
  let sum = 0;
  let doubleDigit = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = Number(cardNumber[i]);

    if (doubleDigit) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
}

function authorizeDemoCard(cardNumber: string) {
  const approvedCards = ["4242424242424242", "5555555555554444"];
  const declinedCards = ["4000000000000002"];

  if (declinedCards.includes(cardNumber)) {
    return {
      approved: false,
      message: "Demo card declined."
    };
  }

  if (!approvedCards.includes(cardNumber)) {
    return {
      approved: false,
      message: "Use demo card 4242 4242 4242 4242."
    };
  }

  return {
    approved: true,
    message: `Approved ${maskCardNumber(cardNumber)}`
  };
}

function refresh() {
  if (!vm) {
    return;
  }

  vm.set(
    "products",
    productStore.filteredProducts.map(product => ({
      id: product.id,
      name: product.name,
      categoryText: `${product.category} / ${product.subCategory}`,
      priceText: money(product.price),
      graphicText: graphicText(product.category),
      productCardAutomationText: `product-card-${product.id}`,
      graphicAutomationText: `product-graphic-${product.id}`,
      graphicTextAutomationText: `product-graphic-text-${product.id}`,
      nameAutomationText: `product-name-${product.id}`,
      metaAutomationText: `product-meta-${product.id}`,
      priceAutomationText: `product-price-${product.id}`,
      addAutomationText: `product-add-${product.id}`
    }))
  );

  vm.set(
    "cartItems",
    cartStore.items.map(item => ({
      ...item,
      detail: `${item.size || ""} ${item.color || ""} Qty: ${item.qty}`,
      priceText: money(item.price * item.qty),
      rowAutomationText: `cart-item-${item.variantId}`,
      nameAutomationText: `cart-item-name-${item.variantId}`,
      detailAutomationText: `cart-item-detail-${item.variantId}`,
      priceAutomationText: `cart-item-price-${item.variantId}`
    }))
  );

  const itemCount = cartStore.items.reduce((sum, item) => sum + item.qty, 0);
  const hasItems = itemCount > 0;

  vm.set("cartCountText", hasItems ? `${itemCount} item${itemCount === 1 ? "" : "s"}` : "Empty cart");
  vm.set("subtotalText", `Subtotal: ${money(cartStore.subtotal)}`);
  vm.set("taxText", `Tax: ${money(cartStore.tax)}`);
  vm.set("totalText", `Total: ${money(cartStore.total)}`);
  vm.set("demoPaymentHint", "Demo card: 4242 4242 4242 4242");
  vm.set("cartVisible", visibility(hasItems));
  vm.set("emptyCartVisible", visibility(!hasItems));
  vm.set("checkoutButtonVisible", visibility(hasItems && !IsVisible("paymentVisible")));

  vm.set("shoesVisible", visibility(filterStore.selectedCategory === "shoes"));
  vm.set("bootsVisible", visibility(filterStore.selectedCategory === "boots"));
}

function IsVisible(propertyName: string) {
  return vm.get(propertyName) === "visible";
}

function setMessage(message: string) {
  vm.set("messageText", message);
  vm.set("messageVisible", visibility(true));
}

function clearMessage() {
  vm.set("messageText", "");
  vm.set("messageVisible", visibility(false));
}

function showPayment() {
  clearMessage();
  vm.set("paymentCardNumber", "4242 4242 4242 4242");
  vm.set("paymentTitleText", `Charge ${money(cartStore.total)}`);
  vm.set("paymentVisible", visibility(true));
  vm.set("checkoutButtonVisible", visibility(false));
}

function hidePayment() {
  vm.set("paymentVisible", visibility(false));
  vm.set("checkoutButtonVisible", visibility(cartStore.items.length > 0));
}

function addProduct(product: Product) {
  const variant = product.variants[0];

  if (!variant) {
    alert("No variant available");
    return;
  }

  const result = cartStore.add(product, variant);

  if (!result.added) {
    setMessage(result.message || "No stock available.");
  }

  refresh();
}

export function onProductAddTap(args: any) {
  const button = args.object;
  const item = button.bindingContext;

  const product = productStore.products.find(p => p.id === item.id);

  if (!product) {
    alert("Product not found");
    return;
  }

  addProduct(product);
}

export function onAllTap() {
  filterStore.setCategory("all");
  refresh();
}

export function onShoesTap() {
  filterStore.setCategory("shoes");
  refresh();
}

export function onBootsTap() {
  filterStore.setCategory("boots");
  refresh();
}

export function onTshirtsTap() {
  filterStore.setCategory("tshirts");
  refresh();
}

export function onAccessoriesTap() {
  filterStore.setCategory("accessories");
  refresh();
}

export function onRunningTap() {
  filterStore.setSubCategory("running");
  refresh();
}

export function onHikingTap() {
  filterStore.setSubCategory("hiking");
  refresh();
}

export function onCheckoutTap() {
  if (cartStore.items.length === 0) {
    setMessage("Cart is empty");
    return;
  }

  showPayment();
}

export function onPaymentCancelTap() {
  hidePayment();
}

export function onPaymentSubmitTap() {
  const total = money(cartStore.total);
  const cardNumber = normalizeCardNumber(vm.get("paymentCardNumber") || "");

  if (cardNumber.length < 13 || cardNumber.length > 19 || !passesLuhn(cardNumber)) {
    setMessage("Enter a valid demo card number.");
    return;
  }

  const authorization = authorizeDemoCard(cardNumber);

  if (!authorization.approved) {
    setMessage(authorization.message);
    return;
  }

  try {
    cartStore.completeSale(cardNumber.slice(-4));
    productStore.load();
    hidePayment();
    refresh();
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "Unable to complete sale.");
    return;
  }

  setMessage(`Sale completed. ${authorization.message}. Total: ${total}`);
}

export function onMessageOkTap() {
  clearMessage();
}
