import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Section } from "@/components/ui/section";
import { UserManager } from "@/components/user-manager";
import { Pagination } from "@/components/ui/pagination";
import { getPageParam, paginate } from "@/lib/pagination";

export const metadata = { title: "Users" } satisfies Metadata;

const PAGE_SIZE = 10;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const admin = await getCurrentUser();
  if (!admin) return null;

  const total = await prisma.user.count();
  const { page, totalPages, skip, take } = paginate(
    total,
    getPageParam((await searchParams).page),
    PAGE_SIZE,
  );

  const rows = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      _count: { select: { articles: true } },
    },
  });

  const users = rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    active: u.active,
    articleCount: u._count.articles,
  }));

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">Users</h1>
      <p className="mt-2 text-sm text-muted">Create users and manage roles and access.</p>
      <UserManager users={users} currentAdminId={admin.id} total={total} />
      <Pagination page={page} totalPages={totalPages} basePath="/admin/users" />
    </Section>
  );
}
