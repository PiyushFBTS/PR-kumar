import type { Metadata } from "next";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Experience & Credentials",
  description:
    "Selected engagements across search & seizure advisory, forensic audits, due diligence and ERP implementation — described by sector and scale, in keeping with professional confidentiality.",
};

interface Item {
  text: string;
}
interface Credential {
  title: string;
  blurb: string;
  items: Item[];
  intro?: string; // paragraph shown above the list
  outro?: string; // paragraph shown below the list
  simpleList?: boolean; // render as a plain bulleted list instead of the card grid
}

// Client identities are intentionally withheld (sector + scale only) in keeping
// with ICAI professional-conduct / confidentiality requirements.
const CREDENTIALS: Credential[] = [
  {
    title: "Investigations, Search & Seizure",
    blurb: "Extensive experience handling search & seizure litigation for clients across sectors:",
    items: [{ text: "FMCG" }, { text: "Steel" }, { text: "Real Estate" }, { text: "Infrastructure" }],
    simpleList: true,
  },
  {
    title: "Forensic Audits & Investigations",
    blurb: "Deep experience in forensic audits and fraud investigations.",
    items: [
      {
        text: "Conducted a forensic audit for a national skill-development body at one of its partner entities in Chennai; our findings led to the partner's expulsion and recovery proceedings for the invested amount.",
      },
      {
        text: "Investigated suspected fraud by employees and cashiers at a large FMCG company — identifying the perpetrators and strengthening internal systems.",
      },
      {
        text: "Investigated the purchase and stores function of a garment exporter on suspicion of fraud and theft.",
      },
    ],
    simpleList: true,
  },
  {
    title: "Financial & Direct Tax Due Diligence",
    blurb: "Buy-side and project due diligence supporting acquisitions and new ventures.",
    items: [
      {
        text: "Financial and direct-tax due diligence on multiple projects and acquisitions for large FMCG groups.",
      },
      {
        text: "Financial and direct-tax due diligence for a leading garment export house with turnover exceeding ₹400 crore.",
      },
      {
        text: "Financial and direct-tax due diligence enabling a large FMCG company to acquire a leading restaurant chain in Delhi NCR.",
      },
    ],
    simpleList: true,
  },
  {
    title: "ERP Implementation",
    blurb:
      "Partners in implementing ERPs while incorporating controls as per business requirements and regulatory frameworks.",
    intro: "We have partnered with various ERP systems, such as:",
    items: [
      { text: "RAMCO 3x, RAMCO 5x" },
      { text: "Navision" },
      { text: "LS Retail" },
      { text: "Business Central" },
      { text: "SAP HANA4" },
    ],
    outro: "Sectors include FMCG, QSR and Manufacturing.",
    simpleList: true,
  },
  {
    title: "Process Optimisation",
    blurb:
      "Our team have successfully partnered in business process optimisation activities while:",
    items: [
      {
        text: "Drafting of standard operating procedures (SOPs) for various functions for various business houses.",
      },
      {
        text: "Validation of Bill of Material (BoM) in a control environment and implementation thereof in related ERP systems.",
      },
    ],
    simpleList: true,
  },
];

// A distinct accent per category for a colourful, scannable layout.
const THEMES = [
  {
    top: "border-t-cyan-500",
    iconBg: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    dot: "bg-cyan-500",
  },
  {
    top: "border-t-amber-500",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  {
    top: "border-t-emerald-500",
    iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  {
    top: "border-t-violet-500",
    iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    dot: "bg-violet-500",
  },
];

function CatIcon({ index }: { index: number }) {
  const common = {
    className: "h-6 w-6",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (index) {
    case 0: // Search & seizure — magnifier
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case 1: // Forensic — shield check
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 2: // Due diligence — document check
      return (
        <svg {...common}>
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <path d="M14 3v6h6" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );
    default: // ERP — chip
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
        </svg>
      );
  }
}

export default function ExperiencePage() {
  return (
    <>
      <Hero
        image="/cover/experience.jpg"
        eyebrow="Our Experience & Credentials"
        title="Decades of advisory, assurance and litigation experience."
        subtitle="Selected engagements across investigations, forensic audits, due diligence and ERP implementation."
      />

      <Section>
        <div className="space-y-8">
          {CREDENTIALS.map((cat, idx) => {
            const t = THEMES[idx % THEMES.length];
            return (
              <details
                key={cat.title}
                className={cn(
                  "group rounded-2xl border border-t-4 border-border bg-background shadow-sm",
                  t.top,
                )}
              >
                <summary className="flex cursor-pointer list-none items-start gap-4 p-6 sm:p-8 [&::-webkit-details-marker]:hidden">
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      t.iconBg,
                    )}
                  >
                    <CatIcon index={idx} />
                  </span>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-brand">{cat.title}</h2>
                    <p className="mt-1 text-sm text-muted">{cat.blurb}</p>
                  </div>
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>

                <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                  {cat.intro ? (
                    <p className="mb-3 text-sm leading-relaxed text-foreground sm:text-base">
                      {cat.intro}
                    </p>
                  ) : null}

                  {cat.simpleList ? (
                    <ul className="space-y-3">
                      {cat.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-3 text-foreground">
                          <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", t.dot)} />
                          <span className="text-sm leading-relaxed sm:text-base">{it.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {cat.items.map((it, i) => (
                        <li
                          key={i}
                          className="flex gap-3 rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm"
                        >
                          <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", t.dot)} />
                          <p className="text-sm leading-relaxed text-foreground">{it.text}</p>
                        </li>
                      ))}
                    </ul>
                  )}

                  {cat.outro ? (
                    <p className="mt-4 text-sm leading-relaxed text-foreground sm:text-base">
                      {cat.outro}
                    </p>
                  ) : null}
                </div>
              </details>
            );
          })}
        </div>
      </Section>
    </>
  );
}
