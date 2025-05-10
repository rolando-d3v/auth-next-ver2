import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { schema } from "./schema";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  // session: {
  //   strategy: "database",
  // },
  providers: [
    Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = schema.parse(credentials);

        const user = await prisma.user.findUnique({
          where: {
            email: validatedCredentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

        // verificar si la contraseña es correcta
        const isValid = await bcrypt.compare(
          validatedCredentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // ✅ Borrar sesiones activas ANTES de iniciar una nueva de google o credentials
    async signIn({ user }) {
      // console.log(user);

      await prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      });

      return true;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id; // <- Aquí agregamos el id en la sesión
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      // se ejecuta cada vez que se crea un jwt
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        // Create session in database  moddo credenciales
        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});
