"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export interface BoardRole {
  id: number;
  title: string;
  department: string | null;
  location: string | null;
  type: string;
  remote: boolean;
  description: string;
  createdAt: string; // ISO
}

const TYPE_LABEL: Record<string, string> = {
  QUALIFIED: "Qualified Professional",
  SEMI_QUALIFIED: "Semi-Qualified Professional",
  PAID_ASSOCIATE: "Paid Associate",
  ARTICLESHIP: "Articleship",
  JOB: "Job",
  INTERNSHIP: "Internship",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86_400_000;
  if (diff < day) return "Today";
  const days = Math.floor(diff / day);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

const selectClass =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

export function JobBoard({ roles }: { roles: BoardRole[] }) {
  const [keyword, setKeyword] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [location, setLocation] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sort, setSort] = useState("recent");

  const departments = useMemo(
    () => [...new Set(roles.map((r) => r.department).filter((d): d is string => !!d))].sort(),
    [roles],
  );
  const locations = useMemo(
    () => [...new Set(roles.map((r) => r.location).filter((l): l is string => !!l))].sort(),
    [roles],
  );

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const out = roles.filter((r) => {
      if (department !== "ALL" && r.department !== department) return false;
      if (location !== "ALL" && r.location !== location) return false;
      if (type !== "ALL" && r.type !== type) return false;
      if (remoteOnly && !r.remote) return false;
      if (
        kw &&
        !`${r.title} ${r.department ?? ""} ${r.location ?? ""} ${r.description}`
          .toLowerCase()
          .includes(kw)
      )
        return false;
      return true;
    });
    out.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "oldest" ? da - db : db - da;
    });
    return out;
  }, [roles, keyword, department, location, type, remoteOnly, sort]);

  function reset() {
    setKeyword("");
    setDepartment("ALL");
    setLocation("ALL");
    setType("ALL");
    setRemoteOnly(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Filter sidebar */}
      <aside className="h-fit rounded-xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <h2 className="font-semibold text-brand">Filter jobs</h2>
          <button type="button" onClick={reset} className="text-xs text-brand-accent hover:underline">
            Reset
          </button>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Search</label>
            <input
              placeholder="Keywords…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={selectClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">
              Department
            </label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className={selectClass}>
              <option value="ALL">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass}>
              <option value="ALL">All locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">Job type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
              <option value="ALL">All job types</option>
              <option value="QUALIFIED">Qualified Professional</option>
              <option value="SEMI_QUALIFIED">Semi-Qualified Professional</option>
              <option value="PAID_ASSOCIATE">Paid Associate</option>
              <option value="ARTICLESHIP">Articleship</option>
            </select>
          </div>
          <label className="flex items-center gap-2 pt-1 text-sm text-foreground">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
            />
            Remote jobs only
          </label>
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted">
            {filtered.length} job{filtered.length === 1 ? "" : "s"} found
          </p>
          <label className="flex items-center gap-2 text-sm text-muted">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
            No roles match your filters. Try clearing them — or send us your résumé using the form
            below.
          </p>
        ) : (
          <ul className="space-y-4">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-brand">{r.title}</h3>
                    {r.department ? (
                      <p className="mt-1 text-sm text-brand-accent">{r.department}</p>
                    ) : null}
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span>{timeAgo(r.createdAt)}</span>
                      <span className="rounded-full border border-border px-2 py-0.5 uppercase tracking-wide">
                        {TYPE_LABEL[r.type] ?? r.type}
                      </span>
                      {r.remote ? (
                        <span className="text-brand-accent">Remote</span>
                      ) : r.location ? (
                        <span>📍 {r.location}</span>
                      ) : null}
                    </p>
                  </div>
                  <Button href={`/careers/open-roles/${r.id}`} variant="outline" size="sm">
                    View details
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
