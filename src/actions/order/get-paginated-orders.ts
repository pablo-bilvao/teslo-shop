"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedOrders = async () => {
  const session = await auth();
  try {
    const user = session?.user;
    if (!user) {
      return {
        ok: false,
        message: "User is not logged in",
      };
    }

    if (user.role !== "admin") {
      return {
        ok: false,
        message: "User is not an admin",
      };
    }

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
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
