"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrdersByUser = async () => {
  const session = await auth();
  try {
    const user = session?.user;
    if (!user) {
      return {
        ok: false,
        message: "User is not logged in",
      };
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      ok: true,
      orders,
    };
  } catch (err) {
    console.error(err);

    return {
      ok: false,
      message: "Error getting orders by user",
    };
  }
};
