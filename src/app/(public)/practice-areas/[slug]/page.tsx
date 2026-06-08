import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { practiceAreas } from "@/content/firm";

type Params = { slug: string };

// Pre-render one static page per practice area.
export function generateStaticParams(): Params[] {
  return practiceAreas.map((area) => ({ slug: area.slug }));
}

function getArea(slug: string) {
  return practiceAreas.find((area) => area.slug === slug);
}

// Per-area hero cover images (public/cover/area/*). Extensions vary.
const areaCover: Record<string, string> = {
  "assurance-advisory": "/cover/area/assurance-advisory.jpg",
  "tax-advisory": "/cover/area/tax-advisory.png",
  "business-advisory": "/cover/area/business-advisory.jpg",
  "management-advisory": "/cover/area/management-advisory.jpeg",
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return { title: "Practice Areas" };
  return { title: area.name, description: area.summary };
}

export default async function PracticeAreaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  return (
    <>
      <Hero
        image={areaCover[area.slug]}
        eyebrow="Practice area"
        title={area.name}
        subtitle={area.summary}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-brand">Services</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {area.services.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-2 rounded border border-border bg-background p-3 text-sm text-foreground"
                >
                  <span aria-hidden className="mt-0.5 text-brand-accent">
                    ✓
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-lg border border-border bg-surface p-6">
            <p className="text-xs uppercase tracking-wide text-muted">
              {area.leads.length > 1 ? "Lead partners" : "Lead partner"}
            </p>
            <ul className="mt-1 space-y-1">
              {area.leads.map((n) => (
                <li key={n} className="text-lg font-semibold text-brand">
                  CA {n}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Speak to our team about {area.name.toLowerCase()} for your organisation.
            </p>
            <Button href="/contact" className="mt-5 w-full">
              Enquire now
            </Button>
          </aside>
        </div>
      </Section>
    </>
  );
}
