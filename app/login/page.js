"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    await signIn("credentials", {
      ...form,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Login</h2>

        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Login
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
