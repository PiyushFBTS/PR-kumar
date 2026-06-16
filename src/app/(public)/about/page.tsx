import type { Metadata } from "next";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { site } from "@/lib/site";
import { firmHistory, firmValues, sectors } from "@/content/firm";

export const metadata: Metadata = {
  title: "About",
  description:
    "P. R. Kumar & Co. — a New Delhi Chartered Accountancy firm founded in 1981, serving corporates, banks and the middle market.",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        image="/cover/about.jpg"
        eyebrow="About the firm"
        title="Advising the middle market since 1981."
        subtitle={firmHistory.intro}
      />

      <Section title="Our mission">
        <ul className="list-disc space-y-2 pl-5 text-lg text-foreground">
          <li>{firmHistory.mission1}</li>
          <li>{firmHistory.mission2}</li>
          <li>{firmHistory.mission3}</li>
        </ul>
        {/* <p className="max-w-3xl text-lg text-foreground">{firmHistory.mission1}
        </p>
        <p className="max-w-3xl text-lg text-foreground">{firmHistory.mission2}
        </p>
        <p className="max-w-3xl text-lg text-foreground">{firmHistory.mission3}
        </p> */}
      </Section>

      <Section title="What we stand for" className="bg-surface">
        <div className="grid gap-6 sm:grid-cols-2">
          {firmValues.map((value) => (
            <Card key={value.title} title={value.title}>
              {value.body}
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Our office">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-brand">New Delhi</h3>
            <p className="mt-2 text-muted">{site.contact.address}</p>
            <p className="mt-3 text-muted">{site.contact.phone}</p>
            <a href={`mailto:${site.contact.email}`} className="text-muted hover:text-brand">
              {site.contact.email}
            </a>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-brand">The team</h3>
            <p className="mt-2 text-muted">
              A cross-functional team of {site.stats.staff} professionals — chartered accountants,
              auditors including articles , investment bankers, economists and business analysts — led by{" "}
              {site.stats.partners} partners across {site.stats.practiceAreas} practice areas.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Sectors we serve" className="bg-surface">
        <ul className="flex flex-wrap gap-3">
          {sectors.map((sector) => (
            <li
              key={sector}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm text-brand"
            >
              {sector}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
