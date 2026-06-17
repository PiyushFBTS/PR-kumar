"use client";

import { useEffect, useState } from "react";

// Fetches and displays the site's all-time visit count.
export function VisitorCount() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setVisits(typeof d.visits === "number" ? d.visits : 0))
      .catch(() => {});
  }, []);

  return (
    <span className="font-semibold text-primary">
      {visits === null ? "…" : visits.toLocaleString("en-IN")}
    </span>
  );
}
