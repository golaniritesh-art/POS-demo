import { Product } from "../models/Product";

export const seedProducts: Product[] = [
  {
    id: "p1",
    name: "Running Shoe",
    category: "shoes",
    subCategory: "running",
    price: 89.99,
    variants: [
      { id: "v1", sku: "RUN-BLK-8", barcode: "10001", size: "8", color: "Black", stock: 5 },
      { id: "v2", sku: "RUN-BLK-9", barcode: "10002", size: "9", color: "Black", stock: 4 }
    ]
  },
  {
    id: "p2",
    name: "Walking Sneaker",
    category: "shoes",
    subCategory: "walking",
    price: 74.99,
    variants: [
      { id: "v3", sku: "WLK-GRY-8", barcode: "10003", size: "8", color: "Gray", stock: 6 },
      { id: "v4", sku: "WLK-GRY-9", barcode: "10004", size: "9", color: "Gray", stock: 5 }
    ]
  },
  {
    id: "p3",
    name: "Court Sport Shoe",
    category: "shoes",
    subCategory: "sports",
    price: 94.99,
    variants: [
      { id: "v5", sku: "CRT-WHT-10", barcode: "10005", size: "10", color: "White", stock: 4 }
    ]
  },
  {
    id: "p4",
    name: "Canvas Casual Shoe",
    category: "shoes",
    subCategory: "casual",
    price: 54.99,
    variants: [
      { id: "v6", sku: "CAN-NVY-8", barcode: "10006", size: "8", color: "Navy", stock: 8 }
    ]
  },
  {
    id: "p5",
    name: "Trail Jogger",
    category: "shoes",
    subCategory: "jogging",
    price: 104.99,
    variants: [
      { id: "v7", sku: "TRJ-GRN-9", barcode: "10007", size: "9", color: "Green", stock: 3 }
    ]
  },
  {
    id: "p6",
    name: "Hiking Boot",
    category: "boots",
    subCategory: "hiking",
    price: 119.99,
    variants: [
      { id: "v8", sku: "HIK-BRN-9", barcode: "20001", size: "9", color: "Brown", stock: 3 }
    ]
  },
  {
    id: "p7",
    name: "Work Boot",
    category: "boots",
    subCategory: "work",
    price: 139.99,
    variants: [
      { id: "v9", sku: "WRK-TAN-10", barcode: "20002", size: "10", color: "Tan", stock: 5 }
    ]
  },
  {
    id: "p8",
    name: "Winter Boot",
    category: "boots",
    subCategory: "winter",
    price: 129.99,
    variants: [
      { id: "v10", sku: "WIN-BLK-9", barcode: "20003", size: "9", color: "Black", stock: 4 }
    ]
  },
  {
    id: "p9",
    name: "Dress Boot",
    category: "boots",
    subCategory: "dress",
    price: 149.99,
    variants: [
      { id: "v11", sku: "DRS-COG-10", barcode: "20004", size: "10", color: "Cognac", stock: 2 }
    ]
  },
  {
    id: "p10",
    name: "Rain Boot",
    category: "boots",
    subCategory: "rain",
    price: 69.99,
    variants: [
      { id: "v12", sku: "RAN-BLK-8", barcode: "20005", size: "8", color: "Black", stock: 7 }
    ]
  },
  {
    id: "p11",
    name: "Basic Tee",
    category: "tshirts",
    subCategory: "basic",
    price: 19.99,
    variants: [
      { id: "v13", sku: "TEE-BLK-M", barcode: "30001", size: "M", color: "Black", stock: 12 },
      { id: "v14", sku: "TEE-BLK-L", barcode: "30002", size: "L", color: "Black", stock: 10 }
    ]
  },
  {
    id: "p12",
    name: "Graphic Tee",
    category: "tshirts",
    subCategory: "graphic",
    price: 24.99,
    variants: [
      { id: "v15", sku: "GRA-WHT-M", barcode: "30003", size: "M", color: "White", stock: 9 }
    ]
  },
  {
    id: "p13",
    name: "Performance Tee",
    category: "tshirts",
    subCategory: "sports",
    price: 29.99,
    variants: [
      { id: "v16", sku: "PER-BLU-L", barcode: "30004", size: "L", color: "Blue", stock: 8 }
    ]
  },
  {
    id: "p14",
    name: "Oversized Tee",
    category: "tshirts",
    subCategory: "oversized",
    price: 27.99,
    variants: [
      { id: "v17", sku: "OVR-GRY-XL", barcode: "30005", size: "XL", color: "Gray", stock: 6 }
    ]
  },
  {
    id: "p15",
    name: "Pocket Tee",
    category: "tshirts",
    subCategory: "basic",
    price: 22.99,
    variants: [
      { id: "v18", sku: "POC-GRN-M", barcode: "30006", size: "M", color: "Green", stock: 7 }
    ]
  },
  {
    id: "p16",
    name: "Crew Socks",
    category: "accessories",
    subCategory: "socks",
    price: 9.99,
    variants: [
      { id: "v19", sku: "SOC-BLK-OS", barcode: "40001", size: "OS", color: "Black", stock: 20 }
    ]
  },
  {
    id: "p17",
    name: "Comfort Insoles",
    category: "accessories",
    subCategory: "insoles",
    price: 14.99,
    variants: [
      { id: "v20", sku: "INS-GEL-M", barcode: "40002", size: "M", color: "Blue", stock: 10 }
    ]
  },
  {
    id: "p18",
    name: "Flat Laces",
    category: "accessories",
    subCategory: "laces",
    price: 5.99,
    variants: [
      { id: "v21", sku: "LAC-WHT-45", barcode: "40003", size: "45in", color: "White", stock: 18 }
    ]
  },
  {
    id: "p19",
    name: "Shoe Care Kit",
    category: "accessories",
    subCategory: "shoe-care",
    price: 21.99,
    variants: [
      { id: "v22", sku: "CARE-KIT-OS", barcode: "40004", size: "OS", color: "Neutral", stock: 6 }
    ]
  },
  {
    id: "p20",
    name: "Gym Shoe Bag",
    category: "accessories",
    subCategory: "bags",
    price: 18.99,
    variants: [
      { id: "v23", sku: "BAG-BLK-OS", barcode: "40005", size: "OS", color: "Black", stock: 8 }
    ]
  }
];
