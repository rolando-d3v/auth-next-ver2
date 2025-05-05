"use server";

import { registroSchema } from "@/schemas/auth";
import * as z from "zod";
import bcrypt from "bcryptjs";
import {prisma as db} from "@/lib/db";

export const registerActions = async (
  values: z.infer<typeof registroSchema>
) => {
  const validatedFields = registroSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Campos inválidos",
      //   errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existeMail = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (existeMail) {
    return {
      error: "Email ya existe",
    };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: "User Creado" };
};
