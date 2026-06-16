import type { Metadata } from "next";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { practiceAreas } from "@/content/firm";

export const metadata: Metadata = {
  title: "Practice Areas",
  description:
    "Assurance & Advisory, Tax Advisory, Business Advisory and Management Advisory — four connected disciplines from P. R. Kumar & Co.",
};

export default function PracticeAreasPage() {
  return (
    <>
      <Hero
        eyebrow="Practice areas"
        title="Four connected disciplines, one accountable team."
        subtitle="From statutory assurance to tax litigation and ERP implementation — delivered as a single source of financial, process and management expertise."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {practiceAreas.map((area) => (
            <Card key={area.slug} href={`/practice-areas/${area.slug}`} title={area.name}>
              <p>{area.summary}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-brand-accent">
                Led by: {area.leads.map((n) => `Mr. ${n}`).join(", ")}
              </p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
