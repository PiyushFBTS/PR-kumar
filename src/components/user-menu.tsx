"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter((p) => /[A-Za-z]/.test(p))
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "U"
  );
}

// Desktop account dropdown shown when a user is signed in.
export function UserMenu() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (loading) return <span className="hidden h-9 w-9 lg:block" aria-hidden />;

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 lg:inline-block"
      >
        Login
      </Link>
    );
  }

  const items = [
    { label: "My Profile", href: "/account/profile" },
    ...(user.role === "ADMIN" ? [{ label: "Admin Panel", href: "/admin" }] : []),
    { label: "My Articles", href: "/account/articles" },
    { label: "Change Password", href: "/account/password" },
  ];

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-sm text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initials(user.name)}
        </span>
        <span className="max-w-28 truncate font-medium">{user.name.split(" ")[0]}</span>
        <span aria-hidden className="text-xs">
          ▾
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 min-w-56 overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-lg">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate font-medium text-brand">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <ul className="py-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-muted hover:bg-surface hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-border py-1">
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await logout();
                router.push("/");
                router.refresh();
              }}
              className="block w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-surface"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
