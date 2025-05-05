"use client";
import { signIn } from "next-auth/react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Social() {
  return (
    <div className="flex gap-4 m-4">
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
    </div>
  );
}
