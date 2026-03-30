import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function Dashboard() {
  const session = await getServerSession();

  // 🔒 Protect route
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-4">
        <h1 className="text-xl font-semibold">Hello {session.user?.name}</h1>

        <LogoutButton />
      </div>
    </div>
  );
}
