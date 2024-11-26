"use client";

import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";

export const QuantityItemsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const totalItemInCart = useCartStore((state) => state.getTotalItemsInCart());

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div className="relative">
      {totalItemInCart > 0 && (
        <span className="absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
          {totalItemInCart}
        </span>
      )}
      <IoCartOutline className="w-5 h-5" />
    </div>
  );
};
