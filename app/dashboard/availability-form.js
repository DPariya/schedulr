"use client";

import { useState } from "react";

export default function AvailabilityForm() {
  const [slots, setSlots] = useState([
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
  ]);

  const handleSubmit = async () => {
    await fetch("/api/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slots),
    });

    alert("Availability saved!");
  };

  return (
    <div className="bg-white p-4 rounded shadow w-80 space-y-4">
      <h2 className="font-semibold">Set Availability</h2>

      <select
        onChange={(e) =>
          setSlots([{ ...slots[0], dayOfWeek: Number(e.target.value) }])
        }
        className="w-full border p-2"
      >
        <option value={1}>Monday</option>
        <option value={2}>Tuesday</option>
        <option value={3}>Wednesday</option>
        <option value={4}>Thursday</option>
        <option value={5}>Friday</option>
      </select>

      <input
        type="time"
        className="w-full border p-2"
        onChange={(e) => setSlots([{ ...slots[0], startTime: e.target.value }])}
      />

      <input
        type="time"
        className="w-full border p-2"
        onChange={(e) => setSlots([{ ...slots[0], endTime: e.target.value }])}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2"
      >
        Save Availability
      </button>
    </div>
  );
}
