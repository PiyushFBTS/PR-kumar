import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { Pagination } from "@/components/ui/pagination";
import { CoverNote } from "@/components/cover-note";
import { getPageParam, paginate } from "@/lib/pagination";

export const metadata = { title: "Applications" } satisfies Metadata;

const PAGE_SIZE = 10;

interface Experience {
  company?: string;
  years?: string;
  role?: string;
}

const TYPE_LABEL: Record<string, string> = {
  QUALIFIED: "Qualified",
  SEMI_QUALIFIED: "Semi-Qualified",
  PAID_ASSOCIATE: "Paid Associate",
  ARTICLESHIP: "Articleship",
  JOB: "Job",
  INTERNSHIP: "Internship",
};

const TYPE_STYLES: Record<string, string> = {
  QUALIFIED: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
  SEMI_QUALIFIED: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  PAID_ASSOCIATE: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
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
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-240 text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Applicant</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Experience</th>
                <th className="px-4 py-3 font-medium">Cover note</th>
                <th className="px-4 py-3 font-medium">Resume</th>
                <th className="px-4 py-3 font-medium">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.map((a) => {
                const exp = (a.experience as Experience | null) ?? null;
                return (
                  <tr key={a.id} className="align-top transition-colors hover:bg-surface">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand">{a.name}</p>
                      <a
                        href={`mailto:${a.email}`}
                        className="block text-xs text-muted hover:text-brand"
                      >
                        {a.email}
                      </a>
                      <a
                        href={`tel:${a.phone.replace(/\s+/g, "")}`}
                        className="block text-xs text-muted hover:text-brand"
                      >
                        {a.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {a.role ? (
                        <span className="text-foreground">{a.role}</span>
                      ) : (
                        <span className="text-muted">General</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          TYPE_STYLES[a.applyType] ?? "bg-surface text-muted"
                        }`}
                      >
                        {TYPE_LABEL[a.applyType] ?? a.applyType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {a.hasExperience && exp ? (
                        <span className="text-foreground">
                          {exp.role || "—"}
                          {exp.company ? ` · ${exp.company}` : ""}
                          {exp.years ? ` · ${exp.years} yrs` : ""}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      {a.coverNote ? (
                        <CoverNote text={a.coverNote} limit={200} />
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {a.resume ? (
                        <a
                          href={`/api/admin/careers/${a.id}/resume`}
                          className="font-medium text-brand-accent hover:underline"
                        >
                          ↓ Download
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                      {fmtDate(a.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/careers" />
    </Section>
  );
}
