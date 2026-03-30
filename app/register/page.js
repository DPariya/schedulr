"use client";

import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Register</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
