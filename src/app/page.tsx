"use client";

// import { auth, signOut } from "@/auth";

import { signOut, useSession } from "next-auth/react";

export default function Home() {
  // const session = await auth();
  const session = useSession();

  return (
    <div className="">
      <div>{JSON.stringify(session)}</div>

      {/* <form
      action={async () => {
        "use server";
        await signOut();
      }}
      >
        <button
          className="bg-black p-4 text-white"
          type="submit"
        >
          Salir
        </button>
      </form> */}

      <button
        className="bg-black p-4 text-white"
        type="submit"
        onClick={() => signOut()}
      >
        Salir
      </button>
    </div>
  );
}
