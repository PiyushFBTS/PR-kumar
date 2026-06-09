"use client";

import { useState } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-1 w-full rounded border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    setStatus("saving");
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not change your password.");
        setStatus("idle");
        return;
      }
      setStatus("done");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <Section>
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold text-brand">Change password</h1>
        <p className="mt-2 text-sm text-muted">Update the password you use to sign in.</p>

        {status === "done" ? (
          <div className="mt-8 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-800">
            Your password has been changed.{" "}
            <Link href="/account/profile" className="font-medium underline">
              Back to profile
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
            {error ? (
              <p
                role="alert"
                className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            ) : null}

            <div>
              <label htmlFor="current" className="block text-sm font-medium text-brand">
                Current password
              </label>
              <input
                id="current"
                type="password"
                autoComplete="current-password"
                required
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="next" className="block text-sm font-medium text-brand">
                New password
              </label>
              <input
                id="next"
                type="password"
                autoComplete="new-password"
                required
                value={next}
                onChange={(e) => setNext(e.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-brand">
                Confirm new password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
              />
            </div>

            <Button type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Updating…" : "Change password"}
            </Button>
          </form>
        )}
      </div>
    </Section>
  );
}
