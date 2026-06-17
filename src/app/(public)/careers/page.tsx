import type { Metadata } from "next";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Why Join Us",
  description:
    "Why build your career at P. R. Kumar & Co. — broad work, serious clients and partners who invest in how you grow.",
};

// Ticked highlights (paraphrased "what you'll find here").
const highlights = [
  "Structured learning and development",
  "Broad exposure across industries",
  "Merit-based growth opportunities",
  "An inclusive, collaborative culture",
];

const benefits = [
  {
    title: "Wide-ranging exposure",
    body: "Work alongside leading corporates, MNCs and fast-growing businesses across a wide range of industries.",
    accent: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
      </svg>
    ),
  },
  {
    title: "Continuous learning",
    body: "Structured training, workshops and technical sessions designed to sharpen your skills and speed up your growth.",
    accent: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" />
      </svg>
    ),
  },
  {
    title: "Guidance that counts",
    body: "Learn from seasoned partners and professionals who guide you, challenge you and help you reach your potential.",
    accent: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export default function WhyJoinUsPage() {
  return (
    <>
      <Hero
        image="/cover/career.jpg"
        eyebrow="Careers"
        title="Grow with purpose. Work with impact."
        subtitle="We don't just offer jobs — we help you build a career, with the guidance, exposure and platform to grow, lead and make a real difference."
      />

      {/* Build a career — intro + highlights */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left — heading, intro, CTA */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
              Careers at the firm
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-brand sm:text-4xl">
              Build a career that matters
            </h2>
            <p className="mt-4 text-muted">
              At P. R. Kumar &amp; Co., careers are built, not just filled. Whether you&apos;re
              taking your first step or making your next big move, you&apos;ll find the support,
              exposure and opportunities to grow, lead and do work that genuinely makes a difference.
            </p>
            <Button href="/careers/open-roles" className="mt-8">
              View open roles →
            </Button>
          </div>

          {/* Right — highlights card */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <ul className="space-y-5">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand-accent">
                    <Check />
                  </span>
                  <span className="font-medium text-foreground">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Benefit cards */}
      <Section className="bg-surface">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${b.accent}`}>
                {b.icon}
              </div>
              <h3 className="mt-4 font-semibold text-brand">{b.title}</h3>
              <p className="mt-2 text-sm text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA to open roles */}
      <Section>
        <div className="rounded-2xl border border-border bg-ink p-8 text-center text-white sm:p-10">
          <h2 className="text-2xl font-semibold">Ready to take the next step?</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            Browse our current openings and apply — or send us your résumé even if nothing fits
            right now.
          </p>
          <Button href="/careers/open-roles" className="mt-6">
            View open roles →
          </Button>
        </div>
      </Section>
    </>
  );
}
