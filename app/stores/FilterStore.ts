import { makeAutoObservable } from "mobx";
import { Category } from "../models/Product";

class FilterStore {
  selectedCategory: Category | "all" = "all";
  selectedSubCategory: string | "all" = "all";

  constructor() {
    makeAutoObservable(this);
  }

  setCategory(category: Category | "all") {
    this.selectedCategory = category;
    this.selectedSubCategory = "all";
  }

  setSubCategory(subCategory: string | "all") {
    this.selectedSubCategory = subCategory;
  }

  get subCategories() {
    switch (this.selectedCategory) {
      case "shoes":
        return ["running", "walking", "jogging", "sports", "casual"];
      case "boots":
        return ["work", "hiking", "winter", "dress", "ankle", "rain"];
      case "tshirts":
        return ["basic", "graphic", "sports", "oversized"];
      case "accessories":
        return ["socks", "insoles", "laces", "shoe-care", "bags"];
      default:
        return [];
    }
  }
}

export const filterStore = new FilterStore();