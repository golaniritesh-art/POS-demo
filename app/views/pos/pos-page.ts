import { EventData, Page, Observable, alert, inputType, prompt } from "@nativescript/core";
import { productStore } from "../../stores/ProductStore";
import { filterStore } from "../../stores/FilterStore";
import { cartStore } from "../../stores/CartStore";
import { Product } from "../../models/Product";

let vm: Observable;

export function onLoaded(args: EventData) {
  const page = args.object as Page;
  vm = new Observable();
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
      graphicText: graphicText(product.category)
    }))
  );

  vm.set(
    "cartItems",
    cartStore.items.map(item => ({
      ...item,
      detail: `${item.size || ""} ${item.color || ""} Qty: ${item.qty}`,
      priceText: money(item.price * item.qty)
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

  vm.set("shoesVisible", visibility(filterStore.selectedCategory === "shoes"));
  vm.set("bootsVisible", visibility(filterStore.selectedCategory === "boots"));
}

function addProduct(product: Product) {
  const variant = product.variants[0];

  if (!variant) {
    alert("No variant available");
    return;
  }

  const result = cartStore.add(product, variant);

  if (!result.added) {
    alert(result.message || "No stock available.");
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

export async function onCheckoutTap() {
  if (cartStore.items.length === 0) {
    alert("Cart is empty");
    return;
  }

  const total = money(cartStore.total);
  const result = await prompt({
    title: "Demo Credit Card",
    message: `Charge ${total}`,
    okButtonText: "Pay",
    cancelButtonText: "Cancel",
    defaultText: "4242 4242 4242 4242",
    inputType: inputType.number
  });

  if (!result.result) {
    return;
  }

  const cardNumber = normalizeCardNumber(result.text || "");

  if (cardNumber.length < 13 || cardNumber.length > 19 || !passesLuhn(cardNumber)) {
    alert("Enter a valid demo card number.");
    return;
  }

  const authorization = authorizeDemoCard(cardNumber);

  if (!authorization.approved) {
    alert(authorization.message);
    return;
  }

  try {
    cartStore.completeSale(cardNumber.slice(-4));
    productStore.load();
    refresh();
  } catch (error) {
    alert(error instanceof Error ? error.message : "Unable to complete sale.");
    return;
  }

  alert(`Sale completed. ${authorization.message}. Total: ${total}`);
}
