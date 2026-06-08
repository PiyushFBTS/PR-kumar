import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources",
  description: "Key regulatory and government links curated by P. R. Kumar & Co.",
};

// Logos in public/resource/, matched by normalised label.
const LOGOS: Record<string, string> = {
  mca: "/resource/mca.png",
  cbdt: "/resource/cbdt.jpg",
  gst: "/resource/gst.jpg",
  gstportal: "/resource/gst.jpg",
  sebi: "/resource/sebi.jpg",
  rbi: "/resource/rbi.png",
  icai: "/resource/icai.jpg",
};

function logoFor(label: string): string | null {
  return LOGOS[label.toLowerCase().replace(/[^a-z0-9]/g, "")] ?? null;
}

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    select: { id: true, label: true, url: true, logo: true, category: true },
  });

  // Group by category for display.
  const groups = new Map<string, typeof resources>();
  for (const r of resources) {
    const key = r.category?.trim() || "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  return (
    <>
      <Hero
        image="/thought-leadership/resources.jpg"
        eyebrow="Thought Leadership"
        title="Useful resources"
        subtitle="Quick links to the regulatory and government portals we work with most."
      />

      <Section>
        {resources.length === 0 ? (
          <p className="rounded border border-border bg-surface p-6 text-sm text-muted">
            No resources published yet.
          </p>
        ) : (
          <div className="space-y-10">
            {[...groups.entries()].map(([category, items]) => (
              <div key={category}>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  {category}
                </h2>
                <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((r) => {
                    const logo = r.logo ?? logoFor(r.label);
                    return (
                      <li key={r.id}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex h-full flex-col items-center rounded-2xl border border-border bg-background p-8 text-center transition-all hover:-translate-y-0.5 hover:border-brand-accent hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                        >
                          {/* Logo in a uniform tinted frame */}
                          <div className="flex h-28 w-full items-center justify-center rounded-xl bg-surface p-4">
                            {logo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={logo}
                                alt=""
                                aria-hidden
                                className="max-h-20 w-auto object-contain"
                              />
                            ) : (
                              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-sm font-semibold text-muted">
                                {r.label.slice(0, 3).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-6 text-lg font-semibold text-brand">{r.label}</h3>
                          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-accent">
                            Visit site
                            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                              →
                            </span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
