"use server";

import prisma from "@/lib/prisma";

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId,
      },
    });

    if (!order) {
      return {
        ok: false,
        message: "Order not found",
      };
    }

    return {
      ok: true,
      message: "Transaction id set successfully",
    };
  } catch (err) {
    console.error(err);

    return {
      ok: false,
      message: "Error setting transaction id",
    };
  }
};
