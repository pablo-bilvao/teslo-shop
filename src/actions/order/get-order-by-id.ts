"use server";

import prisma from "@/lib/prisma";

export const getOrderById = async (orderId: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        OrderItem: {
          select: {
            quantity: true,
            price: true,
            size: true,
            product: {
              select: {
                id: true,
                title: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
        OrderAddress: {
          include: {
            country: true,
          },
        },
      },
    });

    return {
      ok: true,
      order,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return {
      ok: false,
      message: e.message,
    };
  }
};
