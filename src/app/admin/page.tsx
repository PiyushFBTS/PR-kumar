import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { getViewStats } from "@/lib/analytics";

export const metadata = { title: "Admin Dashboard" } satisfies Metadata;

function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  chart: "M3 3v18h18M7 14l3-3 3 3 5-5",
  clock: "M12 8v4l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  users:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  check: "m9 12 2 2 4-4M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  x: "M15 9l-6 6M9 9l6 6M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  layers: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7",
  briefcase: "M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
};

// Big headline metric in a colour gradient card.
function GradientKpi({
  label,
  value,
  href,
  gradient,
  icon,
}: {
  label: string;
  value: number | string;
  href?: string;
  gradient: string;
  icon: string;
}) {
  const inner = (
    <div className={`relative overflow-hidden rounded-2xl ${gradient} p-6 text-white shadow-sm`}>
      <Icon d={icon} className="absolute -right-3 -top-3 h-20 w-20 text-white/15" />
      <div className="relative z-10">
        <Icon d={icon} className="h-6 w-6 text-white/90" />
        <p className="mt-3 text-3xl font-bold sm:text-4xl">{value}</p>
        <p className="mt-1 text-sm text-white/85">{label}</p>
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="block transition-transform hover:-translate-y-0.5">
      {inner}
    </Link>
  ) : (
    inner
  );
}

// Smaller stat card with a coloured icon chip.
function StatCard({
  label,
  value,
  href,
  chip,
  icon,
}: {
  label: string;
  value: number | string;
  href: string;
  chip: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${chip}`}>
        <Icon d={icon} />
      </span>
      <div>
        <p className="text-2xl font-semibold text-brand">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </Link>
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

      {/* Headline KPIs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GradientKpi
          label="Visits today"
          value={views.today}
          gradient="bg-linear-to-br from-cyan-500 to-blue-600"
          icon={ICONS.eye}
        />
        <GradientKpi
          label="All-time visits"
          value={views.allTime}
          gradient="bg-linear-to-br from-violet-500 to-purple-600"
          icon={ICONS.chart}
        />
        <GradientKpi
          label="Pending review"
          value={pending}
          href="/admin/approvals"
          gradient="bg-linear-to-br from-amber-500 to-orange-600"
          icon={ICONS.clock}
        />
        <GradientKpi
          label="Users"
          value={totalUsers}
          href="/admin/users"
          gradient="bg-linear-to-br from-emerald-500 to-teal-600"
          icon={ICONS.users}
        />
      </div>

      {/* Views trend + attention */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand">Visits — last 7 days</h2>
            <span className="text-xs text-muted">All visitors</span>
          </div>
          <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3">
            {views.last7.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-brand">{d.count}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-linear-to-t from-blue-600 to-cyan-400 transition-all"
                    style={{
                      height: `${(d.count / maxView) * 100}%`,
                      minHeight: d.count ? "6px" : "0",
                    }}
                    title={`${d.count} visits`}
                  />
                </div>
                <span className="text-[10px] text-muted">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <h2 className="font-semibold text-brand">Needs attention</h2>
          {pending > 0 ? (
            <Link
              href="/admin/approvals"
              className="mt-4 block rounded-xl bg-linear-to-br from-amber-50 to-orange-100 p-4 text-amber-800 transition-shadow hover:shadow-md dark:from-amber-500/10 dark:to-orange-500/10 dark:text-amber-300"
            >
              <p className="text-2xl font-bold">{pending}</p>
              <p className="text-sm font-medium">
                article{pending === 1 ? "" : "s"} awaiting review
              </p>
              <span className="mt-2 inline-block text-sm font-medium underline">
                Open the approval queue →
              </span>
            </Link>
          ) : (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Icon d={ICONS.check} className="h-6 w-6" />
              <p className="mt-2 font-medium">All caught up — nothing pending.</p>
            </div>
          )}
        </div>
      </div>

      {/* Content & submissions */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted">
        Content &amp; submissions
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Approved (live)"
          value={approved}
          href="/admin/articles?status=APPROVED"
          chip="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
          icon={ICONS.check}
        />
        <StatCard
          label="Rejected"
          value={rejected}
          href="/admin/articles?status=REJECTED"
          chip="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
          icon={ICONS.x}
        />
        <StatCard
          label="Drafts"
          value={draft}
          href="/admin/articles?status=DRAFT"
          chip="bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300"
          icon={ICONS.doc}
        />
        <StatCard
          label="Total articles"
          value={totalArticles}
          href="/admin/articles"
          chip="bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300"
          icon={ICONS.layers}
        />
        <StatCard
          label="Enquiries"
          value={enquiries}
          href="/admin/enquiries"
          chip="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
          icon={ICONS.mail}
        />
        <StatCard
          label="Applications"
          value={applications}
          href="/admin/careers"
          chip="bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
          icon={ICONS.briefcase}
        />
      </div>
    </Section>
  );
}
