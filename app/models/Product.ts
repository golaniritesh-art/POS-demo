export type Category =
  | "shoes"
  | "boots"
  | "tshirts"
  | "accessories";

export interface ProductVariant {
  id: string;
  sku: string;
  barcode: string;
  size?: string;
  color?: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  subCategory?: string;
  price: number;
  variants: ProductVariant[];
}