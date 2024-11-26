"use server";

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: bcryptjs.hashSync(data.password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      ok: true,
      message: "Cuenta creada correctamente",
      user,
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Error al crear la cuenta",
    };
  }
};
