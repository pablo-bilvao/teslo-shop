"use client";

import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import { ProductImage as Image } from "@/components";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const removeProductFromCart = useCartStore((state) => state.removeFromCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;

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
              <Link
                className="hover:underline cursor-pointer"
                href={`/product/${product.slug}`}
              >
                {product.size} - {product.title}
              </Link>
            </p>
            <p>${product.price}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChange={(value) =>
                updateProductQuantity(product, value)
              }
            />

            <button
              onClick={() => removeProductFromCart(product)}
              className="underline mt-3"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
