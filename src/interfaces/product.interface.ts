export interface Product {
  id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  categoryId: string;
  // type: string;
  gender: Gender;
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size: Size;
}

export interface ProductImage {
  id: number;
  url: string;
}

export type Gender = "men" | "women" | "kid" | "unisex";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ValidType = "shirts" | "pants" | "hoodies" | "hats";
