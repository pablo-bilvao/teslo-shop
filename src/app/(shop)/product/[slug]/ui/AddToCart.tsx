"use client";
import { QuantitySelector, SizeSelector } from "@/components";
import { Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import { useState } from "react";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [, setIsLoading] = useState<boolean>(false);

  const addToCart = () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    if (!size) {
      setErrorMessage("Debe seleccionar una talla*");
      setIsLoading(false);
      return;
    }

    if (quantity < 1) {
      setErrorMessage("Debe seleccionar una cantidad*");
      setIsLoading(false);
      return;
    }

    if (product.inStock < quantity) {
      setErrorMessage("No hay suficiente stock*");
      setIsLoading(false);
      return;
    }

    addProductToCart({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity,
      size,
    });

    setIsLoading(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {errorMessage && (
        <span className="mt-2 text-red-500 fade-in">{errorMessage}</span>
      )}

      {/* Selector de tallas */}
      {product.inStock > 0 && (
        <SizeSelector
          onSizeChange={setSize}
          availableSizes={product.sizes}
          selectedSize={size}
        />
      )}

      {/* Selector de cantidad */}
      {product.inStock > 0 && (
        <QuantitySelector
          quantity={quantity}
          maxQuantity={product.inStock}
          onQuantityChange={setQuantity}
        />
      )}

      {/* Boton */}
      {product.inStock > 0 && (
        <button onClick={addToCart} className="btn-primary my-5">
          Agregar al carrito
        </button>
      )}
    </>
  );
};
