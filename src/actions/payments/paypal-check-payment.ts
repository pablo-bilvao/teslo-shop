"use server";

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (transactionId: string) => {
  try {
    const bearerToken = await getPayPalBearerToken();
    if (!bearerToken) {
      return {
        ok: false,
        error: "Failed to get PayPal bearer token",
      };
    }

    const orderStatus = await verifyPayPalPayment(transactionId, bearerToken);
    if (!orderStatus) {
      return {
        ok: false,
        error: "Failed to verify PayPal payment",
      };
    }

    const { status, purchase_units } = orderStatus;
    if (status !== "COMPLETED") {
      return {
        ok: false,
        error: "Payment not completed",
      };
    }

    try {
      await prisma.order.update({
        where: {
          id: purchase_units[0].invoice_id,
        },
        data: {
          isPaid: true,
          paidAt: new Date(),
        },
      });

      revalidatePath(`/orders/${purchase_units[0].invoice_id}`);

      return {
        ok: true,
      };
    } catch (err) {
      console.error(err);

      return {
        ok: false,
        error: "Failed to update order",
      };
    }
  } catch (err) {
    console.error(err);

    return {
      ok: false,
      error: "Failed to check payment",
    };
  }
};

const getPayPalBearerToken = async () => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  try {
    const response = await fetch(process.env.PAYPAL_OAUTH_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
        cache: "no-store",
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error(err);

    return null;
  }
};

const verifyPayPalPayment = async (
  transactionId: string,
  bearerToken: string
) => {
  try {
    const response = await fetch(
      `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const data: PayPalOrderStatusResponse = await response.json();

    return data;
  } catch (err) {
    console.error(err);

    return null;
  }
};
