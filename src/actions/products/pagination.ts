"use server";

import { Gender } from "@/interfaces";
import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      take,
      skip: (page - 1) * take,
      where: {
        gender,
      },
    });

    const totalCount = await prisma.product.count({
      where: {
        gender,
      },
    });

    return {
      currentPage: page,
      totalPages: Math.ceil(totalCount / take),
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
        type: product.category.name,
      })),
    };
  } catch (err) {
    console.error(err);

    throw new Error("Error fetching products");
  }
};
