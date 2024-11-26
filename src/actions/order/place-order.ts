"use server";

import { auth } from "@/auth.config";
import { Address } from "@/interfaces";
import { ProductToOrder } from "@/interfaces/order.interface";
import prisma from "@/lib/prisma";

export const placeOrder = async (
  productsInCart: ProductToOrder[],
  address: Address
) => {
  try {
    const session = await auth();
    const userId = session?.user.id;

    // Verificar sesión del usuario
    if (!userId) {
      return {
        ok: false,
        message: "User not found",
      };
    }

    // Obtener la información de los productos
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productsInCart.map((product) => product.productId),
        },
      },
    });

    // Calcular los montos
    const { totalItems, subTotal } = productsInCart.reduce(
      (acc, product) => {
        const productInfo = products.find((p) => p.id === product.productId);

        if (!productInfo) {
          throw new Error("Product not found");
        }

        acc.totalItems += product.quantity;
        acc.subTotal += productInfo.price * product.quantity;

        return acc;
      },
      { totalItems: 0, subTotal: 0 }
    );
    const tax = subTotal * 0.15;
    const total = subTotal + tax;

    const prismaTx = await prisma.$transaction(async (tx) => {
      //1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map(async (product) => {
        const productQuantity = productsInCart
          .filter((p) => p.productId === product.id)
          .reduce((acc, p) => acc + p.quantity, 0);

        if (productQuantity === 0) {
          throw new Error(`Product quantity for ${product.id} is zero`);
        }

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });
      const updatedProducts = await Promise.all(updatedProductsPromises);
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} is out of stock`);
        }
      });

      //2. Crear la orden
      const { country, ...restAddress } = address;

      const order = await tx.order.create({
        data: {
          subTotal,
          tax,
          total,
          itemsInOrder: totalItems,
          userId,
          OrderItem: {
            createMany: {
              data: productsInCart.map((product) => {
                const productInfo = products.find(
                  (p) => p.id === product.productId
                );

                if (!productInfo) {
                  throw new Error("Product not found");
                }

                return {
                  quantity: product.quantity,
                  size: product.size,
                  price: productInfo.price,
                  productId: product.productId,
                };
              }),
            },
          },
          OrderAddress: {
            create: {
              ...restAddress,
              countryId: country,
            },
          },
        },
      });

      return { order };
    });

    return {
      ok: true,
      message: "Order placed successfully",
      data: {
        order: prismaTx.order,
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);

    return {
      ok: false,
      message: error.message,
    };
  }
};
