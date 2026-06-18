import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { Pagination } from "@/components/ui/pagination";
import { CoverNote } from "@/components/cover-note";
import { RowDeleteButton } from "@/components/row-delete-button";
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
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-240 text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Contact number</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enquiries.map((e) => (
                <tr key={e.id} className="align-top transition-colors hover:bg-surface">
                  <td className="px-4 py-3 font-medium text-brand">{e.name}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${e.email}`} className="text-brand hover:underline">
                      {e.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-brand-accent">
                      {e.service}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <CoverNote text={e.message} limit={160} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                    {fmtDate(e.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <RowDeleteButton
                      endpoint={`/api/admin/enquiries/${e.id}`}
                      confirmText={`Delete the enquiry from ${e.name}? This cannot be undone.`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/enquiries" />
    </Section>
  );
}
