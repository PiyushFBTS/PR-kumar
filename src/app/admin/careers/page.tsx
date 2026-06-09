import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { Pagination } from "@/components/ui/pagination";
import { getPageParam, paginate } from "@/lib/pagination";

export const metadata = { title: "Applications" } satisfies Metadata;

const PAGE_SIZE = 10;

interface Experience {
  company?: string;
  years?: string;
  role?: string;
}

const TYPE_STYLES: Record<string, string> = {
  JOB: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
  INTERNSHIP: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  ARTICLESHIP: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};

function fmtDate(d: Date): string {
  return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminCareersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const total = await prisma.jobApplication.count();
  const { page, totalPages, skip, take } = paginate(
    total,
    getPageParam((await searchParams).page),
    PAGE_SIZE,
  );

  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">Career applications</h1>
      <p className="mt-2 text-sm text-muted">
        {total} job, internship and articleship application{total === 1 ? "" : "s"}.
      </p>

      {applications.length === 0 ? (
        <p className="mt-6 rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
          No applications yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {applications.map((a) => {
            const exp = (a.experience as Experience | null) ?? null;
            return (
              <article
                key={a.id}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm"
              >
                <header className="flex items-start justify-between gap-3 border-b border-border bg-surface px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-brand">{a.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{fmtDate(a.createdAt)}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      TYPE_STYLES[a.applyType] ?? "bg-surface text-muted"
                    }`}
                  >
                    {a.applyType}
                  </span>
                </header>

                <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
                  <Detail label="Email">
                    <a href={`mailto:${a.email}`} className="text-brand hover:underline">
                      {a.email}
                    </a>
                  </Detail>
                  <Detail label="Contact number">
                    <a
                      href={`tel:${a.phone.replace(/\s+/g, "")}`}
                      className="text-brand hover:underline"
                    >
                      {a.phone}
                    </a>
                  </Detail>
                  <Detail label="Experience">
                    {a.hasExperience && exp ? (
                      <span className="text-foreground">
                        {exp.role || "—"}
                        {exp.company ? ` · ${exp.company}` : ""}
                        {exp.years ? ` · ${exp.years} yrs` : ""}
                      </span>
                    ) : (
                      <span className="text-muted">No prior experience</span>
                    )}
                  </Detail>
                  <Detail label="Resume">
                    {a.resume ? (
                      <a
                        href={`/api/admin/careers/${a.id}/resume`}
                        className="font-medium text-brand-accent hover:underline"
                      >
                        ↓ Download
                      </a>
                    ) : (
                      <span className="text-muted">Not attached</span>
                    )}
                  </Detail>
                </div>

                {a.coverNote ? (
                  <div className="border-t border-border px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      Cover note
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                      {a.coverNote}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/careers" />
    </Section>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm">{children}</p>
    </div>
  );
}
