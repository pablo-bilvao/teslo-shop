import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  address: {
    id?: string;
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    userId?: string;
  };

  setAddress: (address: State["address"]) => void;
}

export const useAddressStore = create<State>()(
  persist(
    (set) => ({
      address: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
      },
      setAddress: (address) => set({ address }),
    }),
    {
      name: "address-storage",
    }
  )
);
