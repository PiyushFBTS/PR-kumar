import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { RoleManager } from "@/components/role-manager";

export const metadata = { title: "Open Roles" } satisfies Metadata;

export default async function AdminRolesPage() {
  const roles = await prisma.jobPosting.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <Section>
      <h1 className="text-2xl font-semibold text-brand">Open roles</h1>
      <p className="mt-2 text-sm text-muted">
        Post and manage the job, internship and articleship openings shown on the public Open Roles
        page.
      </p>
      <RoleManager roles={roles} />
    </Section>
  );
}
