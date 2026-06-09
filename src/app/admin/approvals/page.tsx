import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { ApprovalQueue } from "@/components/approval-queue";
import { Pagination } from "@/components/ui/pagination";
import { getPageParam, paginate } from "@/lib/pagination";

export const metadata = { title: "Approval Queue" } satisfies Metadata;

const PAGE_SIZE = 10;

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const total = await prisma.article.count({ where: { status: "PENDING" } });
  const { page, totalPages, skip, take } = paginate(
    total,
    getPageParam((await searchParams).page),
    PAGE_SIZE,
  );

  const pending = await prisma.article.findMany({
    where: { status: "PENDING" },
    orderBy: { updatedAt: "asc" },
    skip,
    take,
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      author: { select: { name: true, email: true } },
    },
  });

  const articles = pending.map((a) => ({
    id: a.id,
    title: a.title,
    body: a.body,
    createdAt: a.createdAt.toISOString(),
    author: a.author,
  }));

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">Approval queue</h1>
      <p className="mt-2 text-sm text-muted">
        Review submitted articles. Approving publishes them to the public blog.
      </p>
      <ApprovalQueue articles={articles} />
      <Pagination page={page} totalPages={totalPages} basePath="/admin/approvals" />
    </Section>
  );
}
