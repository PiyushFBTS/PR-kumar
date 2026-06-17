import { site } from "@/lib/site";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LatestBlogs } from "@/components/latest-blogs";
import { CapabilityVenn } from "@/components/capability-venn";
import { practiceAreas, sectors } from "@/content/firm";

export default function HomePage() {
  // Years of experience grows automatically from the firm's founding year.
  const yearsExperience = new Date().getFullYear() - site.established;

  const stats = [
    { value: `${yearsExperience}+`, label: "Years of Experience" },
    { value: "100+", label: "Clients Served" },
    { value: "50+", label: "Awards & Recognitions" },
    { value: `${sectors.length}+`, label: "Industries Served" },
  ];

  // "How we can help" content (from the firm profile).
  const differentiators = [
    "Single source for financial, process and management-tailored assurance needs",
    "Direct & Indirect Tax Consultancy",
    "Software implementation & Process Optimisation",
  ];

  const assistAreas = [
    "Comprehensive direct tax advisory — including search & seizure litigation, representation before all levels of tax authorities (including ITAT) and investigation advisory",
    "Statutory, internal, process, due-diligence and management audits",
    "Investigations and forensic audits for clients and third parties such as lenders and investors",
    "Development and implementation of internal and management information systems, after detailed analysis of your organisation",
    "Efficient, smooth transition into the GST regime — with GST advisory, planning and litigation services",
    "Evaluation and implementation of the most appropriate ERP system — fast, cost-effective and optimised for your process gaps",
    "Showcasing your company to potential business partners, bankers, investors, suppliers and customers",
    "Valuations and tax planning for the company",
  ];

  return (
    <>
      <Hero
        image="/cover/handshake.jpg"
        eyebrow={site.tagline}
        title="Trusted, long-term advisors to corporates, banks and the middle market."
        subtitle="A New Delhi Chartered Accountancy firm since 1981 — single-source financial, process and management assurance, with direct & indirect tax and ERP expertise."
        actions={
          <>
            <Button href="/contact">Get in touch</Button>
            <Button href="/practice-areas" variant="outline-light">
              Our practice areas
            </Button>
          </>
        }
      />

      {/* <TrustStrip
        items={[
          `Est. ${site.established}`,
          `${site.stats.staff} Staff`,
          `${site.stats.partners} Partners`,
        ]}
      /> */}

      {/* Stats band */}
      <Section className="bg-linear-to-br from-primary/10 via-surface to-primary/5">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
          Trusted since {site.established}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-brand sm:text-3xl">
          Decades of financial expertise
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-background p-8 shadow-sm"
            >
              <p className="text-4xl font-bold text-brand-accent sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm font-medium text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Practice areas — left */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-brand sm:text-3xl">Practice areas</h2>
            <p className="mt-3 max-w-2xl text-muted">
              Four connected disciplines, delivered by a cross-functional team of chartered
              accountants, auditors and advisors.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {practiceAreas.map((area) => (
                <Card key={area.slug} href={`/practice-areas/${area.slug}`} title={area.name}>
                  {area.summary}
                </Card>
              ))}
            </div>
          </div>

          {/* Latest insights — right */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold text-brand sm:text-3xl">Latest insights</h2>
            <div className="mt-8">
              <LatestBlogs />
              <Button href="/thought-leadership/blogs" variant="ghost" className="mt-6 px-0">
                Visit Thought Leadership →
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* What we do — and how we can help */}
      <Section>
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
          What we do
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-brand sm:text-3xl">
          …and how we can help
        </h2>
        <p className="mt-4 max-w-3xl text-muted">
          P. R. Kumar &amp; Co. is a niche advisory firm serving domestic clients — from large
          corporates to small and medium enterprises — as well as foreign clients. We offer a full
          suite of assurance, direct and indirect taxation, and strategic advisory services.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Left: interactive strengths diagram + differentiators */}
          <div>
            <CapabilityVenn />

            <h3 className="mt-8 text-lg font-semibold text-brand">
              We differentiate our advisory in three key areas
            </h3>
            <ul className="mt-4 space-y-3">
              {differentiators.map((d) => (
                <li key={d} className="flex gap-3 text-sm text-foreground">
                  <span aria-hidden className="mt-0.5 font-semibold text-brand-accent">
                    ✓
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: how we assist */}
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-brand">We can assist and advise you in</h3>
            <ul className="mt-5 space-y-4">
              {assistAreas.map((a) => (
                <li key={a} className="flex gap-3 text-sm text-foreground">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent"
                  />
                  {a}
                </li>
              ))}
            </ul>
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
