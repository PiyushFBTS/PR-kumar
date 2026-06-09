import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { getViewStats } from "@/lib/analytics";

export const metadata = { title: "Admin Dashboard" } satisfies Metadata;

function KpiCard({
  label,
  value,
  href,
  accent = false,
}: {
  label: string;
  value: number | string;
  href?: string;
  accent?: boolean;
}) {
  const inner = (
    <>
      <p className={`text-3xl font-semibold ${accent ? "text-primary-foreground" : "text-brand"}`}>
        {value}
      </p>
      <p className={`mt-1 text-sm ${accent ? "text-primary-foreground/80" : "text-muted"}`}>
        {label}
      </p>
    </>
  );
  const base = accent
    ? "rounded-xl bg-ink p-6 shadow-sm"
    : "rounded-xl border border-border bg-background p-6 shadow-sm";
  return href ? (
    <Link
      href={href}
      className={`${base} block transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent`}
    >
      {inner}
    </Link>
  ) : (
    <div className={base}>{inner}</div>
  );
}

export default async function AdminDashboardPage() {
  const [
    pending,
    approved,
    rejected,
    draft,
    totalArticles,
    totalUsers,
    enquiries,
    applications,
    views,
  ] = await Promise.all([
    prisma.article.count({ where: { status: "PENDING" } }),
    prisma.article.count({ where: { status: "APPROVED" } }),
    prisma.article.count({ where: { status: "REJECTED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.article.count(),
    prisma.user.count(),
    prisma.enquiry.count(),
    prisma.jobApplication.count(),
    getViewStats(),
  ]);

  const maxView = Math.max(...views.last7.map((d) => d.count), 1);

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Site activity, content and people at a glance.</p>

      {/* KPIs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Visits today" value={views.today} />
        <KpiCard label="All-time visits" value={views.allTime} />
        <KpiCard label="Pending review" value={pending} href="/admin/approvals" />
        <KpiCard label="Users" value={totalUsers} href="/admin/users" />
      </div>

      {/* Views trend + attention */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand">Visits — last 7 days</h2>
            <span className="text-xs text-muted">All visitors</span>
          </div>
          <div className="mt-6 flex h-36 items-end gap-2 sm:gap-3">
            {views.last7.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-brand">{d.count}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-primary transition-all"
                    style={{
                      height: `${(d.count / maxView) * 100}%`,
                      minHeight: d.count ? "4px" : "0",
                    }}
                    title={`${d.count} views`}
                  />
                </div>
                <span className="text-[10px] text-muted">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <h2 className="font-semibold text-brand">Needs attention</h2>
          {pending > 0 ? (
            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-medium">
                {pending} article{pending === 1 ? "" : "s"} awaiting review
              </p>
              <Link href="/admin/approvals" className="mt-1 inline-block font-medium underline">
                Open the approval queue →
              </Link>
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-border bg-surface p-4 text-sm text-muted">
              Nothing pending. You&apos;re all caught up.
            </p>
          )}
        </div>
      </div>

      {/* Content & submissions */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted">
        Content &amp; submissions
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Approved (live)" value={approved} href="/admin/articles?status=APPROVED" />
        <KpiCard label="Rejected" value={rejected} href="/admin/articles?status=REJECTED" />
        <KpiCard label="Drafts" value={draft} href="/admin/articles?status=DRAFT" />
        <KpiCard label="Total articles" value={totalArticles} href="/admin/articles" />
        <KpiCard label="Enquiries" value={enquiries} href="/admin/enquiries" />
        <KpiCard label="Applications" value={applications} href="/admin/careers" />
      </div>
    </Section>
  );
}
