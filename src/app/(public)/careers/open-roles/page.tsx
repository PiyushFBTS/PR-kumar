import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { CareersForm } from "@/components/careers-form";
import { JobBoard, type BoardRole } from "@/components/job-board";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Open Roles",
  description: "Current job, internship and articleship openings at P. R. Kumar & Co., New Delhi.",
};

const steps = [
  { n: "1", title: "Apply", body: "Submit the form below with your details and résumé." },
  { n: "2", title: "Review", body: "Our team reviews your application within a few days." },
  { n: "3", title: "Meet the team", body: "Shortlisted candidates are invited for a conversation." },
];

export default async function OpenRolesPage() {
  const rows = await prisma.jobPosting.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const roles: BoardRole[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    department: r.department,
    location: r.location,
    type: r.type,
    remote: r.remote,
    description: r.description,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <>
      <Hero
        image="/cover/career.jpg"
        eyebrow="Careers"
        title="Open roles"
        subtitle="Current openings across audit, tax and advisory. Don't see a fit? Apply anyway — we're always glad to meet good people."
      />

      <Section>
        <JobBoard roles={roles} />
      </Section>

      {/* How to apply + Apply now — side by side */}
      <Section className="bg-surface">
        <div id="apply" className="scroll-mt-24" />
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* How to apply */}
          <div>
            <h2 className="text-2xl font-semibold text-brand sm:text-3xl">How to apply</h2>
            <ol className="mt-6 space-y-5">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-semibold text-brand">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Apply now form */}
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            <div className="border-b border-border border-t-4 border-t-primary bg-surface px-6 py-5 sm:px-8">
              <h2 className="text-xl font-semibold text-brand">Apply now</h2>
              <p className="mt-1 text-sm text-muted">
                Tell us a little about yourself — your résumé is sent straight to our team.
              </p>
            </div>
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <CareersForm roleOptions={roles.map((r) => r.title)} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
