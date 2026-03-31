"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
