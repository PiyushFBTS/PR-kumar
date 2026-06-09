import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/article-editor";
import { AdminDeleteButton } from "@/components/admin-delete-button";
import { Pagination } from "@/components/ui/pagination";
import { getPageParam, paginate } from "@/lib/pagination";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 10;

export const metadata = { title: "All Articles" } satisfies Metadata;

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "DRAFT"] as const;
type Filter = (typeof FILTERS)[number];

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const statusParam = sp.status?.toUpperCase();
  const active: Filter = (FILTERS as readonly string[]).includes(statusParam ?? "")
    ? (statusParam as Filter)
    : "ALL";

  const where = active === "ALL" ? {} : { status: active };
  const total = await prisma.article.count({ where });
  const { page, totalPages, skip, take } = paginate(total, getPageParam(sp.page), PAGE_SIZE);

  const articles = await prisma.article.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip,
    take,
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
      author: { select: { name: true } },
    },
  });

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">All articles</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "ALL" ? "/admin/articles" : `/admin/articles?status=${f}`}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              active === f
                ? "border-ink bg-ink text-white"
                : "border-border text-muted hover:bg-surface",
            )}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <p className="mt-8 rounded border border-border bg-surface p-6 text-sm text-muted">
          No articles in this view.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
          {articles.map((article) => (
            <li key={article.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-brand">{article.title}</p>
                <p className="mt-1 text-xs text-muted">
                  by {article.author.name} · updated {article.updatedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={article.status} />
                {article.status === "APPROVED" ? (
                  <Link
                    href={`/thought-leadership/blogs/${article.slug}`}
                    className="text-sm font-medium text-brand hover:underline"
                  >
                    View
                  </Link>
                ) : null}
                <AdminDeleteButton id={article.id} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/articles"
        params={{ status: active === "ALL" ? undefined : active }}
      />
    </Section>
  );
}
