"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="bg-white/10 hover:bg-white/20 text-zinc-300 text-sm px-4 py-2 rounded-xl border border-white/10 transition-colors"
    >
      Logout
    </button>
  );
}
