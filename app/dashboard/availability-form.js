"use client";

import { useState } from "react";

export default function AvailabilityForm() {
  const [slots, setSlots] = useState([
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
  ]);

  const handleSubmit = async () => {
    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slots),
    });
    alert("Availability saved!");
  };

  return (
    <div className="space-y-3">
      <select
        onChange={(e) =>
          setSlots([{ ...slots[0], dayOfWeek: Number(e.target.value) }])
        }
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value={1} className="bg-zinc-800">Monday</option>
        <option value={2} className="bg-zinc-800">Tuesday</option>
        <option value={3} className="bg-zinc-800">Wednesday</option>
        <option value={4} className="bg-zinc-800">Thursday</option>
        <option value={5} className="bg-zinc-800">Friday</option>
      </select>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1">Start</label>
          <input
            type="time"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setSlots([{ ...slots[0], startTime: e.target.value }])}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1">End</label>
          <input
            type="time"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setSlots([{ ...slots[0], endTime: e.target.value }])}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
      >
        Save Availability
      </button>
    </div>
  );
}
