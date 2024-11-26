"use client";
import { OpenMenuButton, QuantityItemsInCart } from "@/components";
import { titleFont } from "@/config/fonts";
import { useCartStore } from "@/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

export const TopMenu = () => {
  const [loaded, setLoaded] = useState(false);
  const totalItemInCart = useCartStore((state) => state.getTotalItemsInCart());

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* Logo */}
      <div>
        <Link href="/">
          <span className={`${titleFont.className}} antialiased font-bold`}>
            Teslo
          </span>
          <span> | Shop</span>
        </Link>
      </div>

      {/* Center Menu */}
      <div className="hidden sm:block">
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/category/men"
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/category/women"
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/category/kid"
        >
          Niños
        </Link>
      </div>

      {/* Search, Cart, Menu */}
      <div className="flex items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>

        <Link
          href={totalItemInCart > 0 && loaded ? "/cart" : "/empty"}
          className="mx-2"
        >
          <QuantityItemsInCart />
        </Link>

        <OpenMenuButton />
      </div>
    </nav>
  );
};
