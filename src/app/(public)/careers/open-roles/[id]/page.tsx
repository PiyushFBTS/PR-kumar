import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { CareersForm } from "@/components/careers-form";

export const dynamic = "force-dynamic";

type Params = { id: string };

const TYPE_LABEL: Record<string, string> = {
  QUALIFIED: "Qualified Professional",
  SEMI_QUALIFIED: "Semi-Qualified Professional",
  PAID_ASSOCIATE: "Paid Associate",
  ARTICLESHIP: "Articleship",
  JOB: "Job",
  INTERNSHIP: "Internship",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const role = await prisma.jobPosting.findUnique({
    where: { id: Number(id) || 0 },
    select: { title: true },
  });
  return { title: role?.title ?? "Open Role" };
}

export default async function RoleDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const nid = Number(id);
  if (!Number.isInteger(nid)) notFound();

  const role = await prisma.jobPosting.findUnique({ where: { id: nid } });
  if (!role || !role.published) notFound();

  return (
    <>
      <Hero
        image="/cover/career.jpg"
        eyebrow="Open role"
        title={role.title}
        subtitle={
          [role.department, role.remote ? "Remote" : role.location].filter(Boolean).join(" · ") ||
          undefined
        }
      />

      <Section>
        <Link
          href="/careers/open-roles"
          className="text-sm font-medium text-brand-accent hover:underline"
        >
          ← All open roles
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left — job description */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-primary/15 px-3 py-1 font-semibold uppercase tracking-wide text-brand-accent">
                {TYPE_LABEL[role.type] ?? role.type}
              </span>
              {role.department ? (
                <span className="rounded-full border border-border px-3 py-1 text-muted">
                  {role.department}
                </span>
              ) : null}
              {role.remote ? (
                <span className="rounded-full border border-border px-3 py-1 text-muted">
                  Remote
                </span>
              ) : role.location ? (
                <span className="rounded-full border border-border px-3 py-1 text-muted">
                  📍 {role.location}
                </span>
              ) : null}
            </div>

            <h2 className="mt-5 text-lg font-semibold text-brand">Role description</h2>
            <div className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground">
              {role.description}
            </div>
          </div>

          {/* Right — apply form (sticky on desktop) */}
          <div id="apply" className="scroll-mt-24 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
              <div className="border-b border-border border-t-4 border-t-primary bg-surface px-6 py-5 sm:px-8">
                <h2 className="text-xl font-semibold text-brand">Apply for this role</h2>
                <p className="mt-1 text-sm text-muted">
                  Your application will be tagged to <strong>{role.title}</strong>.
                </p>
              </div>
              <div className="px-6 py-6 sm:px-8 sm:py-8">
                <CareersForm role={role.title} />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
