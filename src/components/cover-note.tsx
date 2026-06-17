"use client";

import { useState } from "react";

// Truncates a long cover note to `limit` chars with a "See more / See less" toggle.
export function CoverNote({ text, limit = 200 }: { text: string; limit?: number }) {
  const [open, setOpen] = useState(false);

  if (text.length <= limit) {
    return <span className="whitespace-pre-wrap text-foreground">{text}</span>;
  }

  return (
    <span className="whitespace-pre-wrap text-foreground">
      {open ? text : `${text.slice(0, limit).trimEnd()}… `}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-medium text-brand-accent hover:underline"
      >
        {open ? " See less" : "See more"}
      </button>
    </span>
  );
}
