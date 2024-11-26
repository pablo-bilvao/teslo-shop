/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { signIn } from "../../auth.config";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      redirect: false,
      ...Object.fromEntries(formData),
    });

    return "Success";
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "CredentialsSignin") {
        return "CredentialsSignin";
      }
    }

    return "UnknownError";
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      ok: true,
    };
  } catch (err) {
    console.log(err);

    return {
      ok: false,
      message: "Error al iniciar sesión",
    };
  }
};
