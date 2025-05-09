"use client";

import * as z from "zod";
import styles from "./registro.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registroSchema } from "@/schemas/auth";
import Link from "next/link";
import { registerActions } from "@/actions/register";
import { useState, useTransition } from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

// loginSchema

type FormData = z.infer<typeof registroSchema>;

export default function RegistroPage() {
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
    <div className={styles.content_registro}>
      <div className={styles.div_registro}>
        <form className={styles.registro} onSubmit={handleSubmit(onSubmit)}>
          <h1 className={styles.title}>Registrate</h1>
          <p className={styles.sub_title}>
            Puedes registrarte con tu cuenta de
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
              name
            </label>
            <input className={styles.input} type="text" {...register("name")} />
            <p>{errors.name?.message}</p>
          </div>
          <div className={styles.formField}>
            <label htmlFor="" className={styles.label}>
              {" "}
              email
            </label>
            <input
              className={styles.input}
              type="email"
              {...register("email")}
            />
            <p>{errors.email?.message}</p>
          </div>

          <div className={styles.formField}>
            <label htmlFor="" className={styles.label}>
              {" "}
              password
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
            Registrarse
          </button>

          <div className={styles.signupContainer}>
            <span className={styles.signupText}>Aqui puedes. </span>
            <Link href={"/auth/login"} className={styles.signupLink}>
              Iniciar Sesion
            </Link>
          </div>
        </form>

        {/* <Social /> */}
      </div>
    </div>
  );
}
