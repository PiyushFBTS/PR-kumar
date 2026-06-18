import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { partnerQuotes } from "@/content/firm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partner Quotes",
  description: "Perspectives from the partners of P. R. Kumar & Co.",
};

// Vivid-but-restrained accents that read well in both light and dark mode.
const accents = [
  { bar: "border-l-cyan-500", mark: "text-cyan-500" },
  { bar: "border-l-teal-500", mark: "text-teal-500" },
  { bar: "border-l-emerald-500", mark: "text-emerald-500" },
  { bar: "border-l-amber-500", mark: "text-amber-500" },
  { bar: "border-l-sky-500", mark: "text-sky-500" },
  { bar: "border-l-rose-500", mark: "text-rose-500" },
];

export default async function QuotesPage() {
  const db = await prisma.partnerQuote.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { id: "asc" }],
    select: { id: true, partner: true, role: true, quote: true },
  });

  // Admin-managed quotes (DB) drive the page; fall back to the static set if empty.
  const quotes = db.length
    ? db.map((q) => ({ key: String(q.id), partner: q.partner, role: q.role ?? "", quote: q.quote }))
    : partnerQuotes.map((q) => ({ key: q.slug, partner: q.partner, role: q.role, quote: q.quote }));

  const [mentor, ...rest] = quotes;

  return (
    <>
      <Hero
        image="/thought-leadership/leadership.jpg"
        eyebrow="Thought Leadership"
        title="In our partners' words"
        subtitle="Perspectives on tax, assurance and advisory from the people who lead the work."
      />

      <Section>
        {/* Mentor — featured on top */}
        {mentor ? (
          <figure className="mb-10 overflow-hidden rounded-2xl bg-ink p-8 text-white sm:p-10">
            {mentor.role ? (
              <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {mentor.role}
              </span>
            ) : null}
            <blockquote className="max-w-3xl text-2xl font-medium leading-snug sm:text-3xl">
              <span aria-hidden className="mr-1 text-primary">
                &ldquo;
              </span>
              {mentor.quote}
              <span aria-hidden className="text-primary">
                &rdquo;
              </span>
            </blockquote>
            <figcaption className="mt-6 text-sm font-semibold text-white/80">
              — Mr. {mentor.partner}
            </figcaption>
          </figure>
        ) : null}

        {/* The rest of the partners */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((q, i) => {
            const accent = accents[(i + 1) % accents.length];
            return (
              <figure
                key={q.key}
                className={cn(
                  "flex flex-col rounded-lg border border-l-4 border-border bg-background p-6",
                  accent.bar,
                )}
              >
                <span aria-hidden className={cn("text-4xl leading-none", accent.mark)}>
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 text-foreground">{q.quote}</blockquote>
                <figcaption className="mt-4">
                  <p className="font-semibold text-brand">Mr. {q.partner}</p>
                  {q.role ? <p className="text-xs text-muted">{q.role}</p> : null}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Section>
    </>
  );
}
