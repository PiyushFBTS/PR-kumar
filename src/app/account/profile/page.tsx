import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Section } from "@/components/ui/section";
import { ProfileForm } from "@/components/profile-form";

export const metadata = { title: "My Profile" } satisfies Metadata;

function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter((p) => /[A-Za-z]/.test(p))
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "U"
  );
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const meta = await prisma.user.findUnique({
    where: { id: user.id },
    select: { createdAt: true },
  });
  const memberSince = meta?.createdAt
    ? new Date(meta.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })
    : "";

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold text-brand">My profile</h1>
        <p className="mt-2 text-sm text-muted">Manage your account details.</p>

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {/* Summary */}
          <div className="sm:col-span-1">
            <div className="rounded-xl border border-border bg-background p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                {initials(user.name)}
              </div>
              <p className="mt-4 font-semibold text-brand">{user.name}</p>
              <span className="mt-2 inline-block rounded-full border border-border px-3 py-0.5 text-xs uppercase tracking-wide text-muted">
                {user.role === "ADMIN" ? "Administrator" : "Member"}
              </span>
              {memberSince ? (
                <p className="mt-3 text-xs text-muted">Member since {memberSince}</p>
              ) : null}
            </div>
          </div>

          {/* Editable details */}
          <div className="sm:col-span-2">
            <div className="rounded-xl border border-border bg-background p-6">
              <ProfileForm initialName={user.name} email={user.email} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
