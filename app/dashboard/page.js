import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import AvailabilityForm from "./availability-form";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-xl font-semibold">
        Hello {session.user?.name || session.user?.email}
      </h1>

      <AvailabilityForm />

      <LogoutButton />
    </div>
  );
}
