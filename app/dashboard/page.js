import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import AvailabilityForm from "./availability-form";
import CopyLinkButton from "./copy-link-button";
import TimezoneForm from "./timezone-form";
import GoogleCalendarButton from "./google-calendar-button";
import prisma from "@/lib/prisma";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // session.user.name is set to username in the auth callback
  const username = session.user?.name;
  const bookingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/u/${username}`;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, timezone: true, googleAccessToken: true },
  });

  const bookings = user
    ? await prisma.booking.findMany({
        where: { userId: user.id, end: { gte: new Date() } },
        orderBy: { start: "asc" },
      })
    : [];

  const userTimezone = user?.timezone || "UTC";
  const googleConnected = !!user?.googleAccessToken;

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

        {/* Timezone */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Your Timezone</h2>
          <p className="text-xs text-gray-400 mb-3">Guests will see your availability in this timezone.</p>
          <TimezoneForm currentTimezone={userTimezone} />
        </div>

        {/* Google Calendar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Google Calendar</h2>
          <p className="text-xs text-gray-400 mb-3">New bookings will automatically appear in your Google Calendar.</p>
          <GoogleCalendarButton connected={googleConnected} />
        </div>

        {/* Availability */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Set Availability</h2>
          <AvailabilityForm />
        </div>

        {/* Upcoming bookings */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No upcoming bookings.</p>
          ) : (
            <ul className="space-y-3">
              {bookings.map((b) => {
                const fmt = (dt, opts) =>
                  new Date(dt).toLocaleString("en-US", { timeZone: userTimezone, ...opts });
                const dateStr = fmt(b.start, { weekday: "short", month: "short", day: "numeric" });
                const startTime = fmt(b.start, { hour: "2-digit", minute: "2-digit" });
                const endTime = fmt(b.end, { hour: "2-digit", minute: "2-digit" });
                return (
                  <li key={b.id} className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{b.guestName}</p>
                      <p className="text-xs text-gray-400">{b.guestEmail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-gray-700">{dateStr}</p>
                      <p className="text-xs text-gray-400">{startTime} – {endTime}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
