"use client";

import { useState, useTransition } from "react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/auth";
import Link from "next/link";
// import { loginActions } from "@/actions/login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import styles from "./login.module.css";
import Image from "next/image";

// loginSchema

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
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
    <div className={styles.content_login}>
      <div className={styles.div_login}>
        <div className={styles.login_left}>
          <div className={styles.div_logo}>
            <Image
              src="/images/logo_rahemsa.png"
              alt="lgo"
              width={40}
              height={40}
              className={styles.logoIcon}
            />
            <span className={styles.logoText}>Rahemsa</span>
          </div>

          <div className={styles.container_text}>
            <blockquote className={styles.quote}>
              Exigete y aprende cada dia
            </blockquote>
            <div className={styles.div_author}>
              <p className={styles.authorName}>Rahemsa</p>
              <p className={styles.authorTitle}>Empresa Digital</p>
            </div>
          </div>
        </div>
        <section className={styles.login_rigth}>
          <form
            className={styles.form_container}
            action=""
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className={styles.title}>Inicia Sesion</h1>
            <p className={styles.sub_title}>
              Puedes iniciar sesion con tu cuenta de
            </p>

            <div className={styles.div_social}>
              <button
                className={styles.googleButton}
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <FcGoogle className={styles.googleLogo} />
                Google
              </button>
              <button
                className={styles.googleButton}
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <FaGithub className={styles.googleLogo} />
                GitHub
              </button>
            </div>
            <div className={styles.divider}>
              <span className={styles.dividerText}>
                O usar otras credenciales
              </span>
            </div>

            <div className={styles.formField}>
              <label htmlFor="" className={styles.label}>
                {" "}
                Email
              </label>
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  type="email"
                  {...register("email")}
                />
              </div>
              <p>{errors.email?.message}</p>
            </div>
            <div className={styles.formField}>
              <label htmlFor="" className={styles.label}>
                {" "}
                Password
              </label>
              <input
                className={styles.input}
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
              className={styles.loginButton}
              type="submit"
            >
              Iniciar sesion
            </button>

            <div className={styles.signupContainer}>
              <span className={styles.signupText}>No tienes una cuenta? </span>
              <Link href={"/auth/registro"} className={styles.signupLink}>
                Registrate Gratis
              </Link>
            </div>
          </form>

          {/* <div className="flex gap-4 m-4">
            <button
              className="w-full  border-2 border-y-violet-300 cursor-pointer "
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <FcGoogle className="inline" />
              google
            </button>
            <button className="w-full  border-2 border-y-violet-300 cursor-pointer ">
              <FaGithub className="inline" />
              Github
            </button>
          </div> */}
        </section>
      </div>
    </div>
  );
}
