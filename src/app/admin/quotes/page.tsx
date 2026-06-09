import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { QuoteManager } from "@/components/quote-manager";
import { Pagination } from "@/components/ui/pagination";
import { getPageParam, paginate } from "@/lib/pagination";

export const metadata = { title: "Partner Quotes" } satisfies Metadata;

const PAGE_SIZE = 10;

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const total = await prisma.partnerQuote.count();
  const { page, totalPages, skip, take } = paginate(
    total,
    getPageParam((await searchParams).page),
    PAGE_SIZE,
  );

  const quotes = await prisma.partnerQuote.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    skip,
    take,
  });

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">Partner quotes</h1>
      <p className="mt-2 text-sm text-muted">
        Manage the quotes shown on the public Thought Leadership page.
      </p>
      <QuoteManager quotes={quotes} />
      <Pagination page={page} totalPages={totalPages} basePath="/admin/quotes" />
    </Section>
  );
}
