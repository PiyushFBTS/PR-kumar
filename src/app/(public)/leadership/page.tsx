import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { partners } from "@/content/firm";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Meet the partners of P. R. Kumar & Co. — a cross-functional leadership team across tax, assurance, advisory and forensic audit.",
};

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter((part) => /[A-Za-z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

// All partners are chartered accountants — prefix the display name with "CA".
function caName(name: string): string {
  return `CA ${name}`;
}

function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground shadow-sm",
        large ? "h-24 w-24 text-3xl" : "h-16 w-16 text-lg",
      )}
    >
      {initialsOf(name)}
    </div>
  );
}

export default function LeadershipPage() {
  const mentor = partners.find((p) => p.slug === "p-k-agarwal");
  const others = partners.filter((p) => p.slug !== "p-k-agarwal");

  return (
    <>
      <Hero
        image="/cover/leadership.jpg"
        eyebrow="Leadership"
        title="Partners who stay close to the work."
        subtitle="Chartered accountants, auditors and advisors with decades of combined experience across taxation, assurance, due diligence and ERP."
      />

      <Section>
        {/* Mentor — featured on top */}
        {mentor ? (
          <Link
            href={`/leadership/${mentor.slug}`}
            className="group mb-12 block overflow-hidden rounded-2xl border-t-4 border-t-primary bg-ink p-8 text-white shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent sm:p-10"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Avatar name={mentor.name} large />
              <div>
                <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                  Mentor &amp; Founder
                </span>
                <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{caName(mentor.name)}</h2>
                <p className="mt-1 text-sm text-white/70">{mentor.credentials}</p>
                <p className="mt-4 max-w-3xl text-white/85">{mentor.bio}</p>
                <span className="mt-4 inline-block text-sm font-medium text-primary">
                  View profile →
                </span>
              </div>
            </div>
          </Link>
        ) : null}

        <h2 className="mb-6 text-xl font-semibold text-brand">The partners</h2>

        {/* The rest of the team — uniform brand accent */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {others.map((partner) => (
            <Link
              key={partner.slug}
              href={`/leadership/${partner.slug}`}
              className="flex flex-col rounded-xl border border-t-4 border-border border-t-primary bg-background p-6 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <div className="flex items-center gap-4">
                <Avatar name={partner.name} />
                <div>
                  <h3 className="text-lg font-semibold text-brand">{caName(partner.name)}</h3>
                  <p className="text-xs text-muted">{partner.credentials}</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-brand-accent">{partner.role}</p>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{partner.bio}</p>
              <span className="mt-4 text-sm font-medium text-brand">View profile →</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
