import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { ResourceManager } from "@/components/resource-manager";
import { Pagination } from "@/components/ui/pagination";
import { getPageParam, paginate } from "@/lib/pagination";

export const metadata = { title: "Resources" } satisfies Metadata;

const PAGE_SIZE = 10;

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const total = await prisma.resource.count();
  const { page, totalPages, skip, take } = paginate(
    total,
    getPageParam((await searchParams).page),
    PAGE_SIZE,
  );

  const resources = await prisma.resource.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    skip,
    take,
  });

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">Resources</h1>
      <p className="mt-2 text-sm text-muted">
        Manage the regulatory links shown on the public Resources page.
      </p>
      <ResourceManager resources={resources} total={total} />
      <Pagination page={page} totalPages={totalPages} basePath="/admin/resources" />
    </Section>
  );
}
