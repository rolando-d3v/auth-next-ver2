"use client";

import { useState, useTransition } from "react";
import * as z from "zod";
import Social from "./Social";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/auth";
import Link from "next/link";
// import { loginActions } from "@/actions/login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// loginSchema

type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  console.log(isPending);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log(values);
    setError("");
    setSuccess("");

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    console.log(result);

    if (result.error !== "CredentialsSignin") {
      router.push("/");
      router.refresh(); // Fuerza la actualización del estado
    }

    if (result.error === "CredentialsSignin") {
      console.error("Error al iniciar sesión:", result.error);
      return alert("Credenciales incorrectas");
    }

    // startTransition(() => {
    //   loginActions(values).then((data) => {
    //     console.log(data);
    //     setError(data?.error);
    //     setSuccess(data?.success);
    //   });
    // });
  };

  return (
    <div className="w-full min-h-screen grid place-items-center  bg-indigo-200  ">
      <div className="w-2xl p-4 rounded-md b-lg bg-white  ">
        <form className="p-4" action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="  w-full flex  flex-col items-center bg-gray-200  gap-2 ">
            <label htmlFor=""> email</label>
            <input
              className="bg-blue-200 w-full p-2 "
              type="email"
              {...register("email")}
            />
            <p>{errors.email?.message}</p>
          </div>
          <div className="  w-full flex  flex-col items-center bg-gray-200  gap-2  ">
            <label htmlFor=""> password</label>
            <input
              className="bg-blue-200  w-full p-2 "
              type="password"
              {...register("password")}
            />
            <p>{errors.password?.message}</p>
          </div>

          <div>
            {error && <p className="bg-red-200  text-red-600">{error}</p>}
            {success && (
              <p className="bg-green-200 text-green-600">{success}</p>
            )}
          </div>
          <button
            disabled={isPending}
            className="bg-green-600 w-full  mt-6 text-cyan-900  p-2  "
            type="submit"
          >
            Login
          </button>
        </form>

        <Social />

        <div className="p-2 bg-amber-700 ">
          <Link href={"/auth/registro"}> ir a Registro</Link>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import React from "react";
// import * as z from "zod";
// import Social from "./Social";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { loginSchema } from "@/schemas/auth";

// // loginSchema

// export default function LoginForm() {
//   const form = useform<z.infer<typeof loginSchema>>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   return (
//     <div className="w-full min-h-screen grid place-items-center  bg-indigo-200  ">
//       <div {...form}>
//         <form action="" onSubmit={form.handleSubmit(() => {})}>
//           <input type="email" name="email" />
//           <input type="password" name="password" />
//           <button></button>
//         </form>
//       </div>
//       <div className="w-3xl p-4 rounded-md b-lg bg-white  ">
//         <Social />
//       </div>
//     </div>
//   );
// }
