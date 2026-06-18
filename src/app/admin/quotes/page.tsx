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

  // Next free position for a new quote (defaults to last).
  const maxOrder = await prisma.partnerQuote.aggregate({ _max: { order: true } });
  const nextPosition = (maxOrder._max.order ?? 0) + 1;

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">Partner quotes</h1>
      <p className="mt-2 text-sm text-muted">
        Manage the quotes shown on the public Thought Leadership page.
      </p>
      <QuoteManager quotes={quotes} nextPosition={nextPosition} />
      <Pagination page={page} totalPages={totalPages} basePath="/admin/quotes" />
    </Section>
  );
}
