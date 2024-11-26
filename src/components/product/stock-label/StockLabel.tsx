"use client";
import { getStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stock, setStock] = useState<null | number>(null);

  const getStock = async () => {
    setIsLoading(true);
    const stock = await getStockBySlug(slug);

    setStock(stock);
    setIsLoading(false);
    return stock;
  };

  useEffect(() => {
    getStock();
  }, []);

  if (isLoading) {
    return (
      <h1
        className={`${titleFont.className} antialiased font-bold text-lg bg-gray-100 animate-pulse w-[80px]`}
      >
        &nbsp;
      </h1>
    );
  }

  if (stock === 0) {
    return <p className="text-red-500 mb-1 font-bold">Producto agotado</p>;
  }

  return (
    <h1 className={`${titleFont.className} antialiased font-bold text-md`}>
      Stock: {stock}
    </h1>
  );
};
