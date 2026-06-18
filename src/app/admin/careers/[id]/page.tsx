import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { RowDeleteButton } from "@/components/row-delete-button";

export const metadata = { title: "Application" } satisfies Metadata;

interface Experience {
  company?: string;
  years?: string;
  role?: string;
}

const TYPE_LABEL: Record<string, string> = {
  QUALIFIED: "Qualified Professional",
  SEMI_QUALIFIED: "Semi-Qualified Professional",
  PAID_ASSOCIATE: "Paid Associate",
  ARTICLESHIP: "Articleship",
  JOB: "Job",
  INTERNSHIP: "Internship",
};

function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter((p) => /[A-Za-z]/.test(p))
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "A"
  );
}

function fmtDate(d: Date): string {
  return new Date(d).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
}

type Params = { id: string };

export default async function ApplicationDetailPage({ params }: { params: Promise<Params> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const a = await prisma.jobApplication.findUnique({ where: { id } });
  if (!a) notFound();

  const exp = (a.experience as Experience | null) ?? null;

  return (
    <Section>
      <Link
        href="/admin/careers"
        className="text-sm font-medium text-brand-accent hover:underline"
      >
        ← All applications
      </Link>

      {/* Header banner */}
      <div className="mt-5 overflow-hidden rounded-2xl bg-ink text-white shadow-sm">
        <div className="bg-linear-to-br from-primary/25 via-transparent to-transparent p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              {initials(a.name)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold sm:text-3xl">{a.name}</h1>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  {TYPE_LABEL[a.applyType] ?? a.applyType}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/75">Applied {fmtDate(a.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <InfoCard
          accent="border-t-cyan-500"
          iconBg="bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300"
          title="Contact"
          icon={<PathIcon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />}
        >
          <Field label="Email">
            <a href={`mailto:${a.email}`} className="text-brand hover:underline">
              {a.email}
            </a>
          </Field>
          <Field label="Phone">
            <a href={`tel:${a.phone.replace(/\s+/g, "")}`} className="text-brand hover:underline">
              {a.phone}
            </a>
          </Field>
        </InfoCard>

        <InfoCard
          accent="border-t-amber-500"
          iconBg="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
          title="Role"
          icon={<PathIcon d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM10 5h4v2h-4z" />}
        >
          <Field label="Applied for">
            {a.role ? (
              <span className="text-foreground">{a.role}</span>
            ) : (
              <span className="text-muted">General application</span>
            )}
          </Field>
          <Field label="Type">
            <span className="text-foreground">{TYPE_LABEL[a.applyType] ?? a.applyType}</span>
          </Field>
        </InfoCard>

        <InfoCard
          accent="border-t-emerald-500"
          iconBg="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
          title="Experience"
          icon={<PathIcon d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />}
        >
          {a.hasExperience && exp ? (
            <>
              <Field label="Role">{exp.role || "—"}</Field>
              <Field label="Company">{exp.company || "—"}</Field>
              <Field label="Years">{exp.years || "—"}</Field>
            </>
          ) : (
            <p className="text-sm text-muted">No prior experience indicated.</p>
          )}
        </InfoCard>

        <InfoCard
          accent="border-t-violet-500"
          iconBg="bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
          title="Résumé"
          icon={<PathIcon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />}
        >
          {a.resume ? (
            <a
              href={`/api/admin/careers/${a.id}/resume`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              ↓ Download résumé
            </a>
          ) : (
            <p className="text-sm text-muted">No résumé attached.</p>
          )}
        </InfoCard>
      </div>

      {/* Cover note */}
      {a.coverNote ? (
        <div className="mt-6 rounded-2xl border border-t-4 border-border border-t-rose-500 bg-background p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Cover note</h2>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed text-foreground">{a.coverNote}</p>
        </div>
      ) : null}

      {/* Danger zone */}
      <div className="mt-8 flex items-center justify-between rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-500/30 dark:bg-red-500/5">
        <p className="text-sm text-muted">Permanently remove this application and its résumé.</p>
        <RowDeleteButton
          endpoint={`/api/admin/careers/${a.id}`}
          confirmText={`Delete the application from ${a.name}? This cannot be undone.`}
        />
      </div>
    </Section>
  );
}

function PathIcon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d={d} />
    </svg>
  );
}

function InfoCard({
  title,
  icon,
  accent,
  iconBg,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-t-4 border-border bg-background p-6 shadow-sm ${accent}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </span>
        <h2 className="font-semibold text-brand">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm">{children}</p>
    </div>
  );
}
