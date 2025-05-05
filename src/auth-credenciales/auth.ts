// import { PrismaAdapter } from "@auth/prisma-adapter";
// import NextAuth from "next-auth";
// import { loginSchema } from "./schemas/auth";
// import db from "./lib/db";
// import bcrypt from "bcryptjs";
// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import { v4 as uuid } from "uuid";
// import { encode as defaultEncode } from "next-auth/jwt";



// const adapter = PrismaAdapter(db);

// export const {
//   handlers,
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   adapter,
//   // session: {
//   // strategy: "database",
//   // strategy: "jwt",
//   // },

//   providers: [
//     Google,
//     Credentials({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const validatedFields = loginSchema.safeParse(credentials);

//         if (validatedFields.success) {
//           const { email, password } = validatedFields.data;

//           const user = await db.user.findUnique({
//             where: { email },
//           });

//           if (!user || !user.password) return null;

//           const passwordsMatch = await bcrypt.compare(
//             password,
//             user.password as string
//           );

//           // if (passwordsMatch) return user;
//           if (passwordsMatch)
//             return {
//               id: user.id,
//               email: user.email,
//               name: user.name,
//             }; // 🔴 MUY IMPORTANTE retornar esto
//         }

//         return null;
//       },
//     }),
//   ],

//   // events: {
//   //   async linkAccount({ user }) {
//   //     await db.user.update({
//   //       where: {
//   //         id: user.id,
//   //       },
//   //       data: {
//   //         emailVerified: new Date(),
//   //       },
//   //     });
//   //   },
//   // },
//   // callbacks: {
//   //   async signIn({ user, account }) {
//   //     if (account?.provider !== "credentials") return true;

//   //     await db.session.deleteMany({
//   //       where: {
//   //         userId: user.id,
//   //       },
//   //     });

//   //     return true;
//   //   },

//   //   async jwt({ token, user }) {
//   //     if (!token.sub) return token;

//   //     if (user) {
//   //       token.id = user.id;
//   //     }

//   //     return token;
//   //   },
//   //   async session({ token, session }) {
//   //     if (token.sub && session.user) {
//   //       session.user.id = token.sub;
//   //     }
//   //     return session;
//   //   },
//   // },

//   callbacks: {
//     // ✅ Borrar sesiones activas ANTES de iniciar una nueva de google o credentials
//     async signIn({ user }) {
//       // console.log(user);

//       await db.session.deleteMany({
//         where: {
//           userId: user.id,
//         },
//       });

//       return true;
//     },

//     async session({ session, user }) {
//       if (session.user) {
//         session.user.id = user.id; // <- Aquí agregamos el id en la sesión
//       }
//       return session;
//     },
//     async jwt({ token, account, user }) {
//       if (account?.provider === "credentials") {
//         token.credentials = true;
//       }
//       // se ejecuta cada vez que se crea un jwt
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//   },
//   jwt: {
//     encode: async function (params) {
//       if (params.token?.credentials) {
//         const sessionToken = uuid();

//         if (!params.token.sub) {
//           throw new Error("No user ID found in token");
//         }

//         // Create session in database  moddo credenciales
//         const createdSession = await adapter?.createSession?.({
//           sessionToken: sessionToken,
//           userId: params.token.sub,
//           expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         });

//         if (!createdSession) {
//           throw new Error("Failed to create session");
//         }

//         return sessionToken;
//       }
//       return defaultEncode(params);
//     },
//   },




//   // pages: {
//   //   signIn: "/auth/login",
//   // },
// });












// ********************



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
