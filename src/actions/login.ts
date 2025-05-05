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

// "use client";
// import { signIn } from "next-auth/react";
// import { loginSchema } from "@/schemas/auth";
// import { useRouter } from "next/navigation";
// import * as z from "zod";

// export const loginActions = async (values: z.infer<typeof loginSchema>)  => {
//   const router = useRouter();
//   const validatedFields = loginSchema.safeParse(values);
//   if (!validatedFields.success) {
//     return { error: "Campos inválidos fielsd" };
//   }
//   const { email, password } = validatedFields?.data;
//   const result = await signIn("credentials", {
//     email,
//     password,
//     redirect: false,
//   });

//   if (result.ok) {
//     router.push("/");
//     router.refresh(); // Fuerza la actualización del estado
//   } else {
//     console.error("Error al iniciar sesión:", result.error);
//   }
// };
