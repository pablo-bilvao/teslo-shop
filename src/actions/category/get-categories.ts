"use server";

import prisma from "@/lib/prisma";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({});

    return {
      ok: true,
      categories,
    };
  } catch (err) {
    console.error(err);

    return {
      ok: false,
      categories: [],
      message: "Error getting categories",
    };
  }
};
