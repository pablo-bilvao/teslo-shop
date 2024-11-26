"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { ProductImage as Image } from "@/components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);
  const router = useRouter();
  const cartSummary = useCartStore((state) => state.summary);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;

  if (cartSummary.totalItems === 0) {
    router.replace("/empty");
    return;
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <Image
            src={product.image}
            width={100}
            height={100}
            alt={product.title}
            className="mr-5 rounded object-cover"
          />

          <div>
            <p>
              <span>
                {product.size} - {product.title} ({product.quantity})
              </span>
            </p>
            <p className="font-bold">
              {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
