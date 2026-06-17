import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { VisitorCount } from "@/components/visitor-count";

// Inline social icons (stroke/fill use currentColor).
function SocialIcon({ name }: { name: string }) {
  const common = { className: "h-5 w-5", viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (name) {
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8h4V24h-4V8zM8 8h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.1c0-1.7-.03-3.9-2.38-3.9-2.38 0-2.74 1.86-2.74 3.78V24H8V8z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black text-white">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="brand-script text-2xl text-white">{site.name}</p>
            <p className="mt-3 text-sm text-white/70">{site.contact.address}</p>
            <p className="mt-3 text-sm text-white/70">{site.contact.phone}</p>
            <a
              href={`mailto:${site.contact.email}`}
              className="text-sm text-white/70 hover:text-white"
            >
              {site.contact.email}
            </a>

            {/* Social links */}
            <ul className="mt-5 flex gap-3">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <SocialIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {site.nav
            .filter((item) => "children" in item)
            .map((item) => (
              <div key={item.href}>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <ul className="mt-3 space-y-2">
                  {"children" in item &&
                    item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="text-sm text-white/70 hover:text-white">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}

          <div>
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2">
              {site.nav
                .filter((item) => !("children" in item) && item.href !== "/")
                .map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-white/70 hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Visitor counter */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/70">
            <span className="uppercase tracking-wide text-white/50">Total visits:</span>{" "}
            <VisitorCount />
          </p>
        </div>
      </Container>
    </footer>
  );
}
