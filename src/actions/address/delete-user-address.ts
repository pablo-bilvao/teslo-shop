"use server";

import prisma from "@/lib/prisma";

export const deleteUserAddress = async (userId: string) => {
  try {
    await deleteUserAddressIfExist(userId);

    return {
      ok: true,
      message: "User address deleted",
    };
  } catch (err) {
    console.error(err);

    return {
      ok: false,
      message: "Error deleting user address",
    };
  }
};

const deleteUserAddressIfExist = async (userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findFirst({
      where: {
        userId,
      },
    });

    if (storedAddress) {
      await prisma.userAddress.delete({
        where: {
          id: storedAddress.id,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
};
