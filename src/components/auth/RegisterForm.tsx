"use client";

import * as z from "zod";
import Social from "./Social";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registroSchema } from "@/schemas/auth";
import Link from "next/link";
import { registerActions } from "@/actions/register";
import { useState, useTransition } from "react";

// loginSchema

type FormData = z.infer<typeof registroSchema>;

export default function RegisterForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  console.log(isPending);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registroSchema),

    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  //   const onSubmit = (data: FormData) => console.log(data);
  const onSubmit = (values: z.infer<typeof registroSchema>) => {
    console.log(values);
    setError("");
    setSuccess("");

    startTransition(() => {
      registerActions(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <div className="w-full min-h-screen grid place-items-center  bg-indigo-200  ">
      <div className="w-2xl p-4 rounded-md b-lg bg-white  ">
        <form className="p-4" action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="  w-full flex  flex-col items-center bg-gray-200  gap-2 ">
            <label htmlFor=""> name</label>
            <input
              className="bg-blue-200 w-full p-2 "
              type="text"
              {...register("name")}
            />
            <p>{errors.name?.message}</p>
          </div>
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
          <Link href={"/auth/login"}>login</Link>
        </div>
      </div>
    </div>
  );
}
