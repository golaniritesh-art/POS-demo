import { makeAutoObservable } from "mobx";
import { database } from "../db/database";
import { Product } from "../models/Product";
import { filterStore } from "./FilterStore";

class ProductStore {
  products: Product[] = [];

  constructor() {
    makeAutoObservable(this);
    this.load();
  }

  load() {
    database.initialize();
    this.products = database.getProducts();
  }

  get filteredProducts() {
    return this.products.filter(product => {
      const categoryMatch =
        filterStore.selectedCategory === "all" ||
        product.category === filterStore.selectedCategory;

      const subCategoryMatch =
        filterStore.selectedSubCategory === "all" ||
        product.subCategory === filterStore.selectedSubCategory;

      return categoryMatch && subCategoryMatch;
    });
  }
}

export const productStore = new ProductStore();
