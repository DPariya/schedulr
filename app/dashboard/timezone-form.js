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
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {timezones.map((tz) => (
          <option key={tz} value={tz} className="bg-zinc-800">{tz}</option>
        ))}
      </select>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-xl transition-colors"
      >
        {saved ? "Saved!" : "Save"}
      </button>
    </div>
  );
}
