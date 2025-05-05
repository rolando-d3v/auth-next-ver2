"use client";

// import { auth, signOut } from "@/auth";

import { signOut, useSession } from "next-auth/react";

export default function PokemonPage() {
  const session = useSession();

  return (
    <div>
      <div>{JSON.stringify(session)}</div>
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
