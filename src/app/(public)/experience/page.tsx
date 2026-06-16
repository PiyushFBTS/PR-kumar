import type { Metadata } from "next";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { SectorBubbles } from "@/components/sector-bubbles";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Experience & Credentials",
  description:
    "Selected engagements across search & seizure advisory, forensic audits, due diligence and ERP implementation — described by sector and scale, in keeping with professional confidentiality.",
};

interface Item {
  period?: string;
  text: string;
}
interface Credential {
  title: string;
  blurb: string;
  items: Item[];
  bubbles?: string[]; // render as floating sector bubbles instead of a list
}

// Client identities are intentionally withheld (sector + scale only) in keeping
// with ICAI professional-conduct / confidentiality requirements.
const CREDENTIALS: Credential[] = [
  {
    title: "Investigations, Search & Seizure",
    blurb: "Extensive experience handling search & seizure litigation for clients across sectors:",
    items: [],
    bubbles: ["FMCG", "Steel", "Real Estate", "Infrastructure"],
  },
  {
    title: "Forensic Audits & Investigations",
    blurb: "Deep experience in forensic audits and fraud investigations.",
    items: [
      {
        period: "2012",
        text: "Conducted a forensic audit for a national skill-development body at one of its partner entities in Chennai; our findings led to the partner's expulsion and recovery proceedings for the invested amount.",
      },
      {
        period: "2015",
        text: "Investigated suspected fraud by employees and cashiers at a large FMCG company — identifying the perpetrators and strengthening internal systems.",
      },
      {
        period: "2017",
        text: "Investigated the purchase and stores function of a garment exporter on suspicion of fraud and theft.",
      },
    ],
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
  },
  {
    title: "ERP Implementation ",
    blurb:
      "Partenrs in implmentting  OF ERPs while incorporating conteols as per business requiremnts and regulartory frameworks",
    items: [
      { period: "2006–07", text: "we have  partnered with various ERP  such as :" },
      {
        period: "2011–12",
        text: "RAMCO 3x , RACMO 5x",
      },
      {
        period: "2011–12",
        text: "Navision",
      },
      {
        period: "2016–17",
        text: "LS Retail",
      },
      { period: "2017–18", text: "Business Central" },
      {
        period: "2019–20",
        text: "SAP HANA4",
      },
      {
        period: "2019–20",
        text: "Sectors include FMCG,QSR,Manufacturing .",
      },
    ],
  },
    {
    title: "Process Optimisation",
    blurb:
      "Our Team have successfully Partnered in Business prorcess optimisation activities while  :",
    items: [
      { period: "2006–07", text: " Drafting of standard operating procedures(SOPs) for various functions for various business houses" },
      {
        period: "2011–12",
        text: "Validation of Bill of Material(BoM) in Control envirment and implements there of BoM in related ERP systems.",
      },
    ],
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

                {cat.bubbles ? (
                  <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                    <SectorBubbles sectors={cat.bubbles} />
                  </div>
                ) : (
                  <ul className="grid gap-3 px-6 pb-6 sm:grid-cols-2 sm:px-8 sm:pb-8">
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
              </details>
            );
          })}
        </div>
      </Section>
    </>
  );
}
