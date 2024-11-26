"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedUsers = async () => {
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

    const users = await prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
    });

    return {
      ok: true,
      users,
    };
  } catch (err) {
    console.error(err);

    return {
      ok: false,
      message: "Error getting users",
    };
  }
};
