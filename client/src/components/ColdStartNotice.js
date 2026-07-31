import React, { useState, useEffect } from "react";

// Cheeky heads-up about the backend spinning up from Render's free-tier sleep.
// Auto-dismisses after a bit, but users can close it early too.
export default function ColdStartNotice({ autoHideMs = 20000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoHideMs) return;
    const timer = setTimeout(() => setVisible(false), autoHideMs);
    return () => clearTimeout(timer);
  }, [autoHideMs]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md">
      <div className="bg-[#E8B9AB] text-white text-sm rounded-xl shadow-lg px-4 py-3 flex items-center justify-between gap-3">
        <span>
          👋 Just give it ~30 seconds — our server's waking up from a nap.
        </span>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 font-bold text-white/90 hover:text-white"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}