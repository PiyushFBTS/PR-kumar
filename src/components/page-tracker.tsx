"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Records ONE view per visit (per browser session) — not per route change —
// so navigating between public pages doesn't inflate the count. Public pages
// only; works for all visitors, signed in or not.
const IGNORE = /^\/(admin|account|login)(\/|$)/;
const SESSION_KEY = "pv_counted";

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't count admin/account/auth areas, and only count once per session.
    if (IGNORE.test(pathname)) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage unavailable (private mode etc.) — fall through and count once.
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      /* ignore tracking failures */
    });
  }, [pathname]);

  return null;
}
