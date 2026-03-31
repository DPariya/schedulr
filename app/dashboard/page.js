import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import AvailabilityForm from "./availability-form";
import CopyLinkButton from "./copy-link-button";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // session.user.name is set to username in the auth callback
  const username = session.user?.name;
  const bookingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/u/${username}`;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Hello, {username}
            </h1>
            <p className="text-sm text-gray-500">Manage your availability</p>
          </div>
          <LogoutButton />
        </div>

        {/* Booking link card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Your Booking Link</h2>
          <p className="text-xs text-gray-400 mb-3">Share this link so others can book time with you.</p>
          <div className="flex items-center gap-2">
            <span className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 truncate">
              /u/{username}
            </span>
            <CopyLinkButton url={bookingUrl} />
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Set Availability</h2>
          <AvailabilityForm />
        </div>
      </div>
    </div>
  );
}
