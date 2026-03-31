"use client";

import { useState } from "react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Generate 30-min slots between startTime and endTime (e.g. "09:00" to "17:00")
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

// Get today's date string in YYYY-MM-DD (local)
function todayStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export default function BookingForm({ userId, availability }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState("");

  // Get available time slots for the selected date
  const slotsForDate = (() => {
    if (!selectedDate) return [];
    const jsDay = new Date(selectedDate + "T00:00:00").getDay(); // 0=Sun,1=Mon,...
    // Schema stores 1=Mon...5=Fri, matching JS getDay for weekdays
    const matchingAvail = availability.filter((a) => a.dayOfWeek === jsDay);
    return matchingAvail.flatMap((a) => generateSlots(a.startTime, a.endTime));
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

    const start = new Date(`${selectedDate}T${selectedSlot.start}:00`);
    const end = new Date(`${selectedDate}T${selectedSlot.end}:00`);

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, guestName, guestEmail, start, end }),
    });

    setLoading(false);
    if (res.ok) {
      setBooked(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  if (booked) {
    return (
      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
        <div className="text-3xl mb-2">✓</div>
        <h3 className="text-lg font-semibold text-green-800">Booking Confirmed!</h3>
        <p className="text-green-700 mt-1 text-sm">
          {selectedDate} at {selectedSlot.label}
        </p>
        <p className="text-green-600 text-sm mt-1">A confirmation has been noted for {guestEmail}.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Date Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <input
          type="date"
          min={todayStr()}
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedSlot(null);
          }}
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Slots
            {selectedDate && (
              <span className="ml-2 text-gray-400 font-normal">
                ({DAY_NAMES[new Date(selectedDate + "T00:00:00").getDay()]})
              </span>
            )}
          </label>
          {slotsForDate.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No availability on this day.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slotsForDate.map((slot) => (
                <button
                  key={slot.label}
                  onClick={() => setSelectedSlot(slot)}
                  className={`border rounded-lg py-2 px-3 text-sm transition-colors ${
                    selectedSlot?.label === slot.label
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input
          type="text"
          placeholder="Jane Doe"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
        <input
          type="email"
          placeholder="jane@example.com"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleBook}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
}
