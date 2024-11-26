import { Size } from "@/interfaces";

export interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}
