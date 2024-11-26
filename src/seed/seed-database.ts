import { env } from "process";
import prisma from "../lib/prisma";
import { initialData } from "./seed";

async function main() {
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  await prisma.category.deleteMany();

  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();

  await prisma.country.deleteMany();

  const categoriesData = initialData.categories.map((category) => ({
    name: category,
  }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();
  const categoriesMap = categoriesDB.reduce((acc, category) => {
    acc[category.name.toLowerCase()] = category.id;
    return acc;
  }, {} as Record<string, string>);

  const productsData = initialData.products;

  for (const product of productsData) {
    await prisma.product.create({
      data: {
        title: product.title,
        inStock: product.inStock,
        sizes: product.sizes,
        slug: product.slug,
        gender: product.gender,
        description: product.description,
        price: product.price,
        categoryId: categoriesMap[product.type],
        ProductImage: {
          create: product.images.map((image) => ({ url: image })),
        },
      },
    });
  }

  const usersData = initialData.users;
  await prisma.user.createMany({
    data: usersData,
  });

  const countriesData = initialData.countries;
  await prisma.country.createMany({
    data: countriesData,
  });

  console.log("Seed ejecutado correctamente");
}

(() => {
  if (env.NODE_ENV !== "development") return;

  main();
})();
