"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { site } from "@/lib/site";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      setUser(data.user);
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-semibold text-brand">Sign in</h1>

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
          <label htmlFor="email" className="block text-sm font-medium text-brand">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-brand">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Login"}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      {/* Left — decorative dark panel (no image) */}
      <div className="relative hidden overflow-hidden text-white lg:flex">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-linear-to-br from-ink via-[#000000] to-cyan-950" />
        {/* Soft colour blobs */}
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-20 left-8 h-44 w-44 rounded-full bg-emerald-400/15 blur-2xl" />
        {/* Triangle accents */}
        <div className="absolute right-12 top-10 flex gap-1 text-lg text-primary/60" aria-hidden>
          <span>▲</span>
          <span>▲</span>
          <span>▲</span>
        </div>
        <div className="absolute bottom-12 left-14 flex gap-1 text-lg text-cyan-300/50" aria-hidden>
          <span>▲</span>
          <span>▲</span>
          <span>▲</span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-14">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">{site.name}</p>
          <h2 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">Welcome back!</h2>
          <p className="mt-5 max-w-sm text-lg text-white/75">
            Sign in to access your account, write articles and manage your submissions.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-16 sm:px-12">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
