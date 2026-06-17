"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const APPLY_TYPES = [
  { value: "QUALIFIED", label: "Qualified Professional" },
  { value: "SEMI_QUALIFIED", label: "Semi-Qualified Professional" },
  { value: "PAID_ASSOCIATE", label: "Paid Associate" },
  { value: "ARTICLESHIP", label: "Articleship" },
];

const COVER_LIMIT = 200;

// Friendly labels for the API's field-error keys.
const FIELD_LABELS: Record<string, string> = {
  applyType: "Applying for",
  role: "Position",
  name: "Full name",
  email: "Email",
  phone: "Phone",
  coverNote: "Cover note",
  resume: "Resume",
};

function messageFromResponse(data: {
  error?: string;
  issues?: Record<string, string[]>;
}): string {
  const issues = data.issues;
  if (issues && typeof issues === "object") {
    const parts = Object.entries(issues)
      .filter(([, msgs]) => Array.isArray(msgs) && msgs.length > 0)
      .map(([field, msgs]) => `${FIELD_LABELS[field] ?? field}: ${msgs[0]}`);
    if (parts.length > 0) return parts.join(" · ");
  }
  return data.error ?? "Could not submit. Please try again.";
}

export function CareersForm({
  role,
  roleOptions,
}: {
  role?: string;
  roleOptions?: string[];
} = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [hasExperience, setHasExperience] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [coverLen, setCoverLen] = useState(0);

  function clearResume() {
    if (resumeRef.current) resumeRef.current.value = "";
    setResumeName(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("hasExperience", hasExperience ? "true" : "false");
      const res = await fetch("/api/careers", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(messageFromResponse(data));
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
        Thank you — your application has been received. We&apos;ll be in touch if there&apos;s a
        fit.
      </p>
    );
  }

  const inputClass =
    "mt-1 w-full rounded border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-5" noValidate>
      {error ? (
        <p
          role="alert"
          className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div>
        <label htmlFor="applyType" className="block text-sm font-medium text-brand">
          Applying for
        </label>
        <select id="applyType" name="applyType" className={inputClass} defaultValue="QUALIFIED">
          {APPLY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-brand">
          Position you&apos;re applying for
        </label>
        {role ? (
          <input
            id="role"
            name="role"
            defaultValue={role}
            readOnly
            className={`${inputClass} bg-surface`}
          />
        ) : roleOptions && roleOptions.length > 0 ? (
          <select id="role" name="role" className={inputClass} defaultValue="">
            <option value="">General application (no specific role)</option>
            {roleOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="role"
            name="role"
            placeholder="e.g. Audit Associate (optional)"
            className={inputClass}
          />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand">
            Full name
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-brand">
            Phone
          </label>
          <input id="phone" name="phone" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand">
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>

      {/* Conditional experience block */}
      <div className="rounded-lg border border-border p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-brand">
          <input
            type="checkbox"
            checked={hasExperience}
            onChange={(e) => setHasExperience(e.target.checked)}
          />
          I have prior work experience
        </label>

        {hasExperience ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="expCompany" className="block text-xs font-medium text-muted">
                Company
              </label>
              <input id="expCompany" name="expCompany" className={inputClass} />
            </div>
            <div>
              <label htmlFor="expYears" className="block text-xs font-medium text-muted">
                Years
              </label>
              <input id="expYears" name="expYears" placeholder="e.g. 3" className={inputClass} />
            </div>
            <div>
              <label htmlFor="expRole" className="block text-xs font-medium text-muted">
                Role
              </label>
              <input id="expRole" name="expRole" className={inputClass} />
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-brand">
          Resume (PDF, DOC or DOCX)
        </label>
        <input
          ref={resumeRef}
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setResumeName(e.target.files?.[0]?.name ?? null)}
          className="mt-1 block w-full cursor-pointer text-sm text-muted file:mr-4 file:w-50 file:cursor-pointer file:rounded-md file:border file:border-border file:bg-surface file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand hover:file:border-brand-accent hover:file:bg-background"
        />

        {resumeName ? (
          <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm">
            <span className="min-w-0 flex-1 truncate text-brand">{resumeName}</span>
            <button
              type="button"
              onClick={clearResume}
              aria-label="Remove selected file"
              title="Remove"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted hover:bg-background hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              ✕
            </button>
          </div>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="coverNote" className="block text-sm font-medium text-brand">
            Cover note (optional)
          </label>
          <span className={`text-xs ${coverLen >= COVER_LIMIT ? "text-red-600" : "text-muted"}`}>
            {coverLen}/{COVER_LIMIT}
          </span>
        </div>
        <textarea
          id="coverNote"
          name="coverNote"
          rows={4}
          maxLength={COVER_LIMIT}
          onChange={(e) => setCoverLen(e.target.value.length)}
          className={inputClass}
        />
      </div>

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
