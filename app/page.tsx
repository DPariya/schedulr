import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold">Schedulr</h1>
      <a href="/login" className="bg-black text-white px-4 py-2">
        Login
      </a>
      <a href="/register" className="border px-4 py-2">
        Register
      </a>
    </div>
  );
}
