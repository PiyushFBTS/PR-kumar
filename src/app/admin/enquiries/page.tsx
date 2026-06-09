import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { Pagination } from "@/components/ui/pagination";
import { getPageParam, paginate } from "@/lib/pagination";

export const metadata = { title: "Enquiries" } satisfies Metadata;

const PAGE_SIZE = 25;

function fmtDate(d: Date): string {
  return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const total = await prisma.enquiry.count();
  const { page, totalPages, skip, take } = paginate(
    total,
    getPageParam((await searchParams).page),
    PAGE_SIZE,
  );

  // Latest on top.
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">Enquiries</h1>
      <p className="mt-2 text-sm text-muted">
        {total} message{total === 1 ? "" : "s"} submitted via the contact form.
      </p>

      {enquiries.length === 0 ? (
        <p className="mt-6 rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
          No enquiries yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {enquiries.map((e) => (
            <article
              key={e.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm"
            >
              <header className="flex items-start justify-between gap-3 border-b border-border bg-surface px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-brand">{e.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{fmtDate(e.createdAt)}</p>
                </div>
                <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-brand-accent">
                  {e.service}
                </span>
              </header>

              <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
                <Detail label="Email">
                  <a href={`mailto:${e.email}`} className="text-brand hover:underline">
                    {e.email}
                  </a>
                </Detail>
                <Detail label="Contact number">
                  {e.phone ? (
                    <a
                      href={`tel:${e.phone.replace(/\s+/g, "")}`}
                      className="text-brand hover:underline"
                    >
                      {e.phone}
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </Detail>
              </div>

              <div className="border-t border-border px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Message</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{e.message}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/enquiries" />
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
