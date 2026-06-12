"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const PILLARS = [
  {
    title: "Experienced Professionals",
    short: ["Experienced", "Professionals"],
    desc: "Chartered accountants, auditors and advisors with decades of combined experience across audit, tax and advisory.",
    cx: 150,
    cy: 92,
    lx: 150,
    ly: 48,
  },
  {
    title: "SME Experience",
    short: ["SME", "Experience"],
    desc: "A hands-on understanding of small and medium enterprises — their controls, constraints and growth needs.",
    cx: 106,
    cy: 172,
    lx: 70,
    ly: 214,
  },
  {
    title: "Pan-Sector Knowledge",
    short: ["Pan-Sector", "Knowledge"],
    desc: "Cross-sector insight spanning banking, manufacturing, services, real estate and more.",
    cx: 194,
    cy: 172,
    lx: 230,
    ly: 214,
  },
];

// Interactive three-circle (Venn) diagram of the firm's core strengths.
export function CapabilityVenn() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <svg
        viewBox="0 0 300 240"
        className="mx-auto w-full max-w-sm"
        role="group"
        aria-label="Our three core strengths"
      >
        {PILLARS.map((p, i) => (
          <circle
            key={p.title}
            cx={p.cx}
            cy={p.cy}
            r={80}
            strokeWidth={2.5}
            tabIndex={0}
            role="button"
            aria-label={p.title}
            aria-pressed={active === i}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className={cn(
              "cursor-pointer outline-none transition-all duration-300",
              active === i
                ? "fill-primary/55 stroke-brand-accent"
                : "fill-primary/15 stroke-transparent hover:fill-primary/30",
            )}
          />
        ))}

        {/* Centre mark (the overlap) */}
        <text
          x={150}
          y={150}
          textAnchor="middle"
          className="pointer-events-none fill-current text-[9px] font-semibold italic text-brand"
        >
          P. R. Kumar
        </text>

        {/* Pillar labels */}
        {PILLARS.map((p, i) => (
          <text
            key={p.title}
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            className={cn(
              "pointer-events-none fill-current text-[10px] font-semibold transition-colors",
              active === i ? "text-brand" : "text-muted",
            )}
          >
            {p.short.map((line, j) => (
              <tspan key={line} x={p.lx} dy={j === 0 ? 0 : 12}>
                {line}
              </tspan>
            ))}
          </text>
        ))}
      </svg>

      {/* Active pillar detail */}
      <div className="mt-5 rounded-xl border border-border bg-surface p-5">
        <h4 className="font-semibold text-brand">{PILLARS[active].title}</h4>
        <p className="mt-1 text-sm text-muted">{PILLARS[active].desc}</p>
      </div>

      {/* Legend / touch targets */}
      <div className="mt-4 flex flex-wrap gap-2">
        {PILLARS.map((p, i) => (
          <button
            key={p.title}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active === i
                ? "border-brand-accent bg-primary/15 text-brand"
                : "border-border text-muted hover:bg-surface",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>
    </div>
  );
}
