import Link from "next/link";

// Server-rendered pagination control. Preserves other query params (e.g. a
// status filter) and only renders when there's more than one page.
export function Pagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function href(p: number): string {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params ?? {})) if (v) sp.set(k, v);
    sp.set("page", String(p));
    return `${basePath}?${sp.toString()}`;
  }

  const linkBase =
    "rounded border border-border px-3 py-2 text-sm text-brand hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";
  const disabled = "rounded border border-border px-3 py-2 text-sm text-muted opacity-50";

  return (
    <nav className="mt-6 flex items-center justify-center gap-4 text-sm" aria-label="Pagination">
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkBase}>
          ← Previous
        </Link>
      ) : (
        <span className={disabled}>← Previous</span>
      )}

      <span className="text-muted">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={href(page + 1)} className={linkBase}>
          Next →
        </Link>
      ) : (
        <span className={disabled}>Next →</span>
      )}
    </nav>
  );
}
