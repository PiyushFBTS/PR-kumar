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
    orderBy: [{ categoryOrder: "asc" }, { order: "asc" }, { id: "asc" }],
    skip,
    take,
  });

  // Category metadata for the form (positions + counts), across ALL resources.
  const all = await prisma.resource.findMany({
    select: { category: true, categoryOrder: true },
    orderBy: [{ categoryOrder: "asc" }, { id: "asc" }],
  });
  const catMap = new Map<string, { position: number; count: number }>();
  for (const r of all) {
    const name = r.category?.trim() || "General";
    const existing = catMap.get(name);
    if (existing) existing.count += 1;
    else catMap.set(name, { position: r.categoryOrder || 1, count: 1 });
  }
  const categoryMeta = [...catMap.entries()].map(([name, v]) => ({ name, ...v }));
  const nextCategoryPosition = categoryMeta.length + 1;

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">Resources</h1>
      <p className="mt-2 text-sm text-muted">
        Manage the regulatory links shown on the public Resources page.
      </p>
      <ResourceManager
        resources={resources}
        total={total}
        categoryMeta={categoryMeta}
        nextCategoryPosition={nextCategoryPosition}
      />
      <Pagination page={page} totalPages={totalPages} basePath="/admin/resources" />
    </Section>
  );
}
