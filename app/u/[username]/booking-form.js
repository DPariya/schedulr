"use client";

import { useState } from "react";

function generateSlots(startTime, endTime) {
  const slots = [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let cur = sh * 60 + sm;
  const end = eh * 60 + em;
  while (cur + 30 <= end) {
    const h = Math.floor(cur / 60).toString().padStart(2, "0");
    const m = (cur % 60).toString().padStart(2, "0");
    const nh = Math.floor((cur + 30) / 60).toString().padStart(2, "0");
    const nm = ((cur + 30) % 60).toString().padStart(2, "0");
    slots.push({ label: `${h}:${m} – ${nh}:${nm}`, start: `${h}:${m}`, end: `${nh}:${nm}` });
    cur += 30;
  }
  return slots;
}

function todayStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function toUTCDate(dateStr, timeStr, timezone) {
  const guessUTC = new Date(`${dateStr}T${timeStr}:00Z`);
  const inTZ = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).format(guessUTC);
  const tzDate = new Date(inTZ.replace(", ", "T") + "Z");
  const offset = guessUTC.getTime() - tzDate.getTime();
  return new Date(guessUTC.getTime() + offset);
}

function getDayOfWeekInTZ(dateStr, timezone) {
  const label = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: timezone })
    .format(new Date(dateStr + "T12:00:00Z"));
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(label);
}

export default function BookingForm({ userId, availability, hostTimezone }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState("");

  const slotsForDate = (() => {
    if (!selectedDate) return [];
    const dayOfWeek = getDayOfWeekInTZ(selectedDate, hostTimezone);
    const matchingAvail = availability.filter((a) => a.dayOfWeek === dayOfWeek);
    return matchingAvail.flatMap((a) =>
      generateSlots(a.startTime, a.endTime).map((slot) => ({ ...slot, key: `${a.id}-${slot.label}` }))
    );
  })();

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) {
      setError("Please select a date and time slot.");
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setError("Please fill in your name and email.");
      return;
    }
    setError("");
    setLoading(true);

    const start = toUTCDate(selectedDate, selectedSlot.start, hostTimezone);
    const end = toUTCDate(selectedDate, selectedSlot.end, hostTimezone);

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, guestName, guestEmail, start, end }),
    });

    setLoading(false);
    if (res.ok) {
      setBooked(true);
    } else if (res.status === 409) {
      setError("This slot is already booked. Please choose another time.");
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  if (booked) {
    return (
      <div className="mt-6 p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
        <div className="text-3xl mb-2">✓</div>
        <h3 className="text-lg font-semibold text-green-400">Booking Confirmed!</h3>
        <p className="text-green-400/80 mt-1 text-sm">
          {selectedDate} at {selectedSlot.label}
        </p>
        <p className="text-slate-400 text-sm mt-1">A confirmation has been noted for {guestEmail}.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Date Picker */}
      <div>
        <label className="block text-sm text-slate-400 mb-1.5">Select Date</label>
        <input
          type="date"
          min={todayStr()}
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedSlot(null);
          }}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Available Slots
            <span className="ml-2 text-slate-500 font-normal text-xs">({hostTimezone})</span>
          </label>
          {slotsForDate.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No availability on this day.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slotsForDate.map((slot) => (
                <button
                  key={slot.key}
                  onClick={() => setSelectedSlot(slot)}
                  className={`border rounded-xl py-2 px-3 text-sm transition-colors ${
                    selectedSlot?.label === slot.label
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "bg-white/5 text-slate-300 border-white/10 hover:border-indigo-400"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Guest Info */}
      <div>
        <label className="block text-sm text-slate-400 mb-1.5">Your Name</label>
        <input
          type="text"
          placeholder="Jane Doe"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1.5">Your Email</label>
        <input
          type="email"
          placeholder="jane@example.com"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={handleBook}
        disabled={loading}
        className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25"
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
}
