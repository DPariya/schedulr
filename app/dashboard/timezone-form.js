"use client";

import { useState, useEffect } from "react";

export default function TimezoneForm({ currentTimezone }) {
  const [timezone, setTimezone] = useState(currentTimezone || "UTC");
  const [timezones, setTimezones] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setTimezones(Intl.supportedValuesOf("timeZone"));
    } catch {
      setTimezones(["UTC"]);
    }
  }, []);

  const handleSave = async () => {
    await fetch("/api/user/timezone", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timezone }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      >
        {timezones.map((tz) => (
          <option key={tz} value={tz}>{tz}</option>
        ))}
      </select>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
      >
        {saved ? "Saved!" : "Save"}
      </button>
    </div>
  );
}
