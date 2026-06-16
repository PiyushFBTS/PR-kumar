import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { partners } from "@/content/firm";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return partners.map((partner) => ({ slug: partner.slug }));
}

function getPartner(slug: string) {
  return partners.find((partner) => partner.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) return { title: "Leadership" };
  return { title: partner.name, description: `${partner.role} — ${partner.credentials}` };
}

export default async function PartnerPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const partner = getPartner(slug);
  if (!partner) notFound();

  return (
    <Section>
      <Container className="mt-8 max-w-3xl px-0">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-accent">
          {partner.role}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-brand sm:text-4xl">Mr. {partner.name}</h1>
        <p className="mt-2 text-muted">{partner.credentials}</p>

        <p className="mt-8 text-lg leading-relaxed text-foreground">{partner.bio}</p>

        {partner.education && partner.education.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-brand-accent">Education and Association</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground marker:text-brand-accent">
              {partner.education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {partner.experience && partner.experience.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-brand-accent">Experience</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground marker:text-brand-accent">
              {partner.experience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* <div className="mt-10 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold text-brand">Contact</h2>
          {partner.phone || partner.email ? (
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {partner.phone ? <li>{partner.phone}</li> : null}
              {partner.email ? (
                <li>
                  <a href={`mailto:${partner.email}`} className="hover:text-brand">
                    {partner.email}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">Reach this partner through our main office.</p>
          )}
          <div className="mt-5 flex gap-3">
            <Button href="/contact" size="sm">
              Get in touch
            </Button>
            <Button href="/leadership" variant="outline" size="sm">
              All partners
            </Button>
          </div>
        </div> */}
      </Container>
    </Section>
  );
}
