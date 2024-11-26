"use server";

import prisma from "@/lib/prisma";

export const getStockBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug,
      },
      select: {
        inStock: true,
      },
    });

    if (!product) return 0;

    return product.inStock;
  } catch (e) {
    console.error(e);

    return 0;
  }
};
