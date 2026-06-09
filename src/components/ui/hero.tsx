import { Container } from "./container";
import { cn } from "@/lib/cn";

// Page hero with optional eyebrow, headline, subcopy and action slot.
// Pass `image` to use a full-bleed cover photo behind the text (no colour cast;
// only a subtle neutral scrim for legibility). Without `image` it falls back to
// the solid brand "ink" background.
export function Hero({
  eyebrow,
  title,
  subtitle,
  actions,
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  image?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden text-white", !image && "bg-ink")}>
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            aria-hidden
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          {/* Neutral (uncoloured) scrim so the text stays readable — darker on
              the left where the copy sits, lighter (but still dimmed) on the right. */}
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/80 via-black/60 to-black/35" />
        </>
      ) : null}

      <Container className="py-20 sm:py-28">
        {eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-widest text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-5 max-w-2xl text-lg text-white/80">{subtitle}</p> : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
      </Container>
    </section>
  );
}
