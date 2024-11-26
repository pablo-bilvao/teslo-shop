import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  summary: {
    subTotal: number;
    tax: number;
    total: number;
    totalItems: number;
  };

  getTotalItemsInCart: () => number;
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeFromCart: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      summary: {
        subTotal: 0,
        tax: 0,
        total: 0,
        totalItems: 0,
      },

      getTotalItemsInCart: () => {
        const { cart } = get();

        return cart.reduce((acc, item) => acc + item.quantity, 0);
      },

      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        if (!productInCart) {
          set({
            cart: [...cart, product],
            summary: getSummaryCart([...cart, product]),
          });
          return;
        }

        const newCart = cart.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );

        set({
          cart: newCart,
          summary: getSummaryCart(newCart),
        });
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        const newCart = cart.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity }
            : item
        );

        set({
          cart: newCart,
          summary: getSummaryCart(newCart),
        });
      },

      removeFromCart: (product: CartProduct) => {
        const { cart } = get();
        const newCart = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        );

        set({
          cart: newCart,
          summary: getSummaryCart(newCart),
        });
      },

      clearCart: () => {
        set({
          cart: [],
          summary: {
            subTotal: 0,
            tax: 0,
            total: 0,
            totalItems: 0,
          },
        });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);

const getSummaryCart = (cart: CartProduct[]) => {
  const subTotal = cart.reduce(
    (subTotal, item) => subTotal + item.price * item.quantity,
    0
  );
  const tax = subTotal * 0.15;
  const total = subTotal + tax;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return {
    subTotal,
    tax,
    total,
    totalItems,
  };
};
