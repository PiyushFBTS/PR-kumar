import type { Metadata } from "next";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { CareersForm } from "@/components/careers-form";

export const metadata: Metadata = {
  title: "Careers",
  description: "Apply for a job, internship or articleship at P. R. Kumar & Co., New Delhi.",
};

const benefits = [
  {
    title: "Varied, real work",
    body: "Exposure across audit, tax, due diligence and ERP — not just one narrow lane.",
    accent: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <path d="M3 7h18v13H3zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    title: "Serious clients",
    body: "Work with leading FMCG, retail and dairy groups on engagements that matter.",
    accent: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
      </svg>
    ),
  },
  {
    title: "Mentorship",
    body: "Learn directly from partners with decades of combined experience.",
    accent: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const steps = [
  { n: "1", title: "Apply", body: "Submit the form with your details and résumé." },
  { n: "2", title: "Review", body: "Our team reviews your application within a few days." },
  {
    n: "3",
    title: "Meet the team",
    body: "Shortlisted candidates are invited for a conversation.",
  },
];

export default function CareersPage() {
  return (
    <>
      <Hero
        image="/cover/career.jpg"
        eyebrow="Careers"
        title="Build your career with us."
        subtitle="We hire chartered accountants, articled assistants and interns who want to do meaningful, varied work for serious clients."
      />

      {/* Why join */}
      <Section
        title="Why join P. R. Kumar & Co."
        lead="A place to do broad, hands-on work for serious clients — with partners who invest in how you grow."
      >
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

      {/* How to apply */}
      <Section title="How to apply" className="bg-surface">
        <ol className="grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="relative rounded-xl border border-border bg-background p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {s.n}
              </span>
              <h3 className="mt-4 font-semibold text-brand">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Application form */}
      <Section>
        <Container className="max-w-3xl px-0">
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            <div className="border-b border-border border-t-4 border-t-primary bg-surface px-6 py-5 sm:px-8">
              <h2 className="text-xl font-semibold text-brand">Apply now</h2>
              <p className="mt-1 text-sm text-muted">
                Tell us a little about yourself — your résumé is sent straight to our team.
              </p>
            </div>
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <CareersForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
