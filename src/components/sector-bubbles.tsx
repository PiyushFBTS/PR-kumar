import { cn } from "@/lib/cn";

// Deterministic per-bubble styling (no random → SSR-safe).
const STYLES = [
  { size: "h-28 w-28 text-base", grad: "from-cyan-400 to-cyan-600", dur: "6s", delay: "0s" },
  { size: "h-24 w-24 text-sm", grad: "from-amber-400 to-amber-600", dur: "7s", delay: "0.7s" },
  { size: "h-32 w-32 text-base", grad: "from-emerald-400 to-emerald-600", dur: "5.5s", delay: "1.2s" },
  { size: "h-24 w-24 text-sm", grad: "from-violet-400 to-violet-600", dur: "6.5s", delay: "0.3s" },
  { size: "h-28 w-28 text-base", grad: "from-rose-400 to-rose-600", dur: "6.2s", delay: "0.9s" },
  { size: "h-24 w-24 text-sm", grad: "from-sky-400 to-sky-600", dur: "7.3s", delay: "0.4s" },
];

// Floating, hover-interactive sector bubbles.
export function SectorBubbles({ sectors }: { sectors: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-8">
      {sectors.map((sector, i) => {
        const s = STYLES[i % STYLES.length];
        return (
          <div
            key={sector}
            className="bubble-float"
            style={{ animation: `float ${s.dur} ease-in-out ${s.delay} infinite` }}
          >
            <div
              className={cn(
                "flex shrink-0 cursor-default items-center justify-center rounded-full bg-linear-to-br text-center font-semibold text-white shadow-lg ring-1 ring-white/20 transition-transform duration-300 hover:scale-110",
                s.size,
                s.grad,
              )}
            >
              {sector}
            </div>
          </div>
        );
      })}
    </div>
  );
}
