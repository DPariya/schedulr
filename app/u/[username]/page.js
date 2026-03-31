import prisma from "@/lib/prisma";
import BookingForm from "./booking-form";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function UserPage({ params }) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: { availability: true },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <p className="text-zinc-400">User not found.</p>
      </div>
    );
  }

  const sortedAvailability = [...user.availability].sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {/* Profile header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3 shadow-lg shadow-emerald-500/30">
              {username[0].toUpperCase()}
            </div>
            <h1 className="text-xl font-bold text-white">{user.name || username}</h1>
            <p className="text-sm text-zinc-400 mt-1">@{username}</p>
          </div>

          {/* Availability summary */}
          {sortedAvailability.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                Available Hours
              </h2>
              <ul className="space-y-1.5">
                {sortedAvailability.map((slot) => (
                  <li key={slot.id} className="flex justify-between text-sm">
                    <span className="font-medium text-zinc-300 w-10">{DAY_NAMES[slot.dayOfWeek]}</span>
                    <span className="text-zinc-400">{slot.startTime} – {slot.endTime}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="text-sm font-semibold text-white mb-1">Schedule a Meeting</h2>
          <p className="text-xs text-zinc-400 mb-2">Pick a date and time that works for you.</p>

          <BookingForm userId={user.id} availability={user.availability} hostTimezone={user.timezone || "UTC"} />
        </div>
      </div>
    </div>
  );
}
