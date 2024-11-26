"use server";

import type { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const savedAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      address: savedAddress,
    };
  } catch (err) {
    console.error(err);

    return {
      ok: false,
      message: "Error setting user address",
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findFirst({
      where: {
        userId,
      },
    });

    const addressToSave = {
      address: address.address,
      address2: address.address2,
      city: address.city,
      countryId: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
      userId,
    };

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });

      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: {
        id: storedAddress.id,
      },
      data: addressToSave,
    });

    return updatedAddress;
  } catch (err) {
    console.error(err);

    throw new Error("Error creating or replacing address");
  }
};
