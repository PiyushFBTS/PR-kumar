"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

const inputClass =
  "mt-1 w-full rounded border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

export function ProfileForm({ initialName, email }: { initialName: string; email: string }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not save your profile.");
        return;
      }
      setMessage("Profile updated.");
      await refresh(); // keep the header menu in sync with the new name
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error ? (
        <p
          role="alert"
          className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800">
          {message}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand">
          Email
        </label>
        <input id="email" value={email} disabled className={`${inputClass} opacity-60`} />
        <p className="mt-1 text-xs text-muted">
          Your email is used to sign in and can&apos;t be changed here.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand">
          Full name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <Button
        type="submit"
        disabled={saving || name.trim() === initialName.trim() || name.trim().length < 2}
      >
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
