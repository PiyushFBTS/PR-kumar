"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export interface ManagedQuote {
  id: number;
  partner: string;
  role: string | null;
  quote: string;
  order: number;
  published: boolean;
}

const emptyForm = { partner: "", role: "", quote: "", order: 1, published: true };
const inputClass =
  "mt-1 w-full rounded border border-border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

export function QuoteManager({
  quotes,
  nextPosition,
}: {
  quotes: ManagedQuote[];
  nextPosition: number;
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<ManagedQuote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function openAdd() {
    setForm({ ...emptyForm, order: nextPosition }); // default to last
    setEditId(null);
    setError(null);
    setFormOpen(true);
  }
  function openEdit(q: ManagedQuote) {
    setForm({
      partner: q.partner,
      role: q.role ?? "",
      quote: q.quote,
      order: q.order,
      published: q.published,
    });
    setEditId(q.id);
    setError(null);
    setFormOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = { ...form, role: form.role || null };
    const res = await fetch(editId ? `/api/admin/quotes/${editId}` : "/api/admin/quotes", {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save the quote.");
      return;
    }
    setFormOpen(false);
    router.refresh();
  }

  async function togglePublished(q: ManagedQuote) {
    await fetch(`/api/admin/quotes/${q.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !q.published }),
    });
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    await fetch(`/api/admin/quotes/${deleteTarget.id}`, { method: "DELETE" });
    setBusy(false);
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted">
          {quotes.length} quote{quotes.length === 1 ? "" : "s"} · one per partner
        </p>
        <Button size="sm" onClick={openAdd}>
          + Add quote
        </Button>
      </div>

      {quotes.length === 0 ? (
        <p className="mt-4 rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
          No quotes yet. Click “Add quote” to create one.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {quotes.map((q) => (
            <li key={q.id} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-brand-accent">
                  {q.order}
                </span>
                <p className="text-sm text-foreground">“{q.quote}”</p>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 pl-9">
                <span className="text-xs font-medium text-brand">
                  — {q.partner}
                  {q.role ? <span className="text-muted"> · {q.role}</span> : null}
                </span>
                <div className="flex items-center gap-3 text-sm">
                  <span
                    className={`text-xs font-medium ${q.published ? "text-green-700" : "text-muted"}`}
                  >
                    {q.published ? "Published" : "Hidden"}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePublished(q)}
                    className="text-brand-accent hover:underline"
                  >
                    {q.published ? "Hide" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(q)}
                    className="font-medium text-brand hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(q)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? "Edit quote" : "Add quote"}
      >
        <form onSubmit={save} className="space-y-4">
          {error ? (
            <p
              role="alert"
              className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-brand">Partner name</label>
            <input
              required
              placeholder="e.g. Ankit Agarwal"
              value={form.partner}
              onChange={(e) => setForm({ ...form, partner: e.target.value })}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-muted">Each partner can have only one quote.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand">
              Role / title <span className="text-muted">(optional)</span>
            </label>
            <input
              placeholder="e.g. Managing Partner"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand">Quote</label>
            <textarea
              required
              rows={4}
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand">Position</label>
            <input
              type="number"
              min={1}
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Math.max(1, Number(e.target.value) || 1) })}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-muted">
              1 = top of the page. New quotes default to the last position.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-brand">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published (visible on the public Quotes page)
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : editId ? "Save changes" : "Add quote"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete quote"
      >
        <p className="text-sm text-foreground">
          Delete the quote from <strong>{deleteTarget?.partner}</strong>? This cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={confirmDelete}
            disabled={busy}
            className="inline-flex h-11 items-center justify-center rounded bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
          <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
