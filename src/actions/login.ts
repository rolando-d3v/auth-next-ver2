// "use server";

// import { signIn } from "@/auth";
// import { loginSchema } from "@/schemas/auth";
// import { AuthError } from "next-auth";
// import * as z from "zod";

// export const loginActions = async (values: z.infer<typeof loginSchema>) => {
//   const validatedFields = loginSchema.safeParse(values);
//   if (!validatedFields.success) {
//     return { error: "Campos inválidos fielsd" };
//   }

//   const { email, password } = validatedFields?.data;

//   try {
//     await signIn("credentials", { email, password, redirectTo: "/" });
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.cause) {
//         case "CredentialsSignin":
//           return { error: "Credenciais inválidas" };
//         default:
//           return { error: "Algo deu errado" };
//       }
//     }

//     throw error;
//   }
// };

"use server";

import { signIn } from "@/auth-credenciales/auth";
// import { signIn } from "next-auth/react";
import { loginSchema } from "@/schemas/auth";
// import { useRouter } from "next/navigation";
import * as z from "zod";

export const loginActions = async (values: z.infer<typeof loginSchema>) => {
  // const router = useRouter();
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Campos inválidos field" };
  }
  const { email, password } = validatedFields?.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: "Inicio de sesión exitoso" };
    // router.push("/");
  } catch (error) {
    console.log(error);
    return { error: "Error:" + error };
  }

  // if (result.ok) {
  //   router.refresh(); // Fuerza la actualización del estado
  // } else {
  //   console.error("Error al iniciar sesión:", result.error);
  // }
};
