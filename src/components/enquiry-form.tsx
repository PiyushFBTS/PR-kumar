"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function EnquiryForm({ services }: { services: string[] }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: services[0] ?? "",
    message: "",
    website: "", // honeypot
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not send. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded border border-green-300 bg-green-50 p-4 text-sm text-green-800">
        Thank you — your enquiry has been sent. We&apos;ll be in touch shortly.
      </p>
    );
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

      {/* Honeypot — visually hidden, ignored by humans. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
        className="hidden"
        aria-hidden
      />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand">
          Name
        </label>
        <input
          id="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-1 w-full rounded border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-brand">
          Contact number
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="mt-1 w-full rounded border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-brand">
          Service of interest
        </label>
        <select
          id="service"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className="mt-1 w-full rounded border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-brand">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="mt-1 w-full rounded border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        />
      </div>

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
