"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export interface ManagedRole {
  id: number;
  title: string;
  department: string | null;
  location: string | null;
  type: string;
  remote: boolean;
  description: string;
  published: boolean;
  order: number;
}

const TYPES = [
  { value: "QUALIFIED", label: "Qualified Professional" },
  { value: "SEMI_QUALIFIED", label: "Semi-Qualified Professional" },
  { value: "PAID_ASSOCIATE", label: "Paid Associate" },
  { value: "ARTICLESHIP", label: "Articleship" },
];

const emptyForm = {
  title: "",
  department: "",
  location: "",
  type: "QUALIFIED",
  remote: false,
  description: "",
  published: true,
};
const inputClass =
  "mt-1 w-full rounded border border-border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

export function RoleManager({ roles }: { roles: ManagedRole[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<ManagedRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setError(null);
    setFormOpen(true);
  }
  function openEdit(r: ManagedRole) {
    setForm({
      title: r.title,
      department: r.department ?? "",
      location: r.location ?? "",
      type: r.type,
      remote: r.remote,
      description: r.description,
      published: r.published,
    });
    setEditId(r.id);
    setError(null);
    setFormOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      ...form,
      department: form.department || null,
      location: form.location || null,
    };
    const res = await fetch(editId ? `/api/admin/roles/${editId}` : "/api/admin/roles", {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save the role.");
      return;
    }
    setFormOpen(false);
    router.refresh();
  }

  async function togglePublished(r: ManagedRole) {
    await fetch(`/api/admin/roles/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !r.published }),
    });
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    await fetch(`/api/admin/roles/${deleteTarget.id}`, { method: "DELETE" });
    setBusy(false);
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted">
          {roles.length} role{roles.length === 1 ? "" : "s"}
        </p>
        <Button size="sm" onClick={openAdd}>
          + Add role
        </Button>
      </div>

      {roles.length === 0 ? (
        <p className="mt-4 rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
          No open roles yet. Click “Add role” to post one.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
          {roles.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-4 p-4 hover:bg-surface">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-brand">{r.title}</p>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    {TYPES.find((t) => t.value === r.type)?.label ?? r.type}
                  </span>
                  <span
                    className={`text-xs font-medium ${r.published ? "text-green-700" : "text-muted"}`}
                  >
                    {r.published ? "Published" : "Hidden"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {[r.department, r.remote ? "Remote" : r.location].filter(Boolean).join(" · ") ||
                    "No department / location"}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => togglePublished(r)}
                  className="font-medium text-brand-accent hover:underline"
                >
                  {r.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(r)}
                  className="font-medium text-brand hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(r)}
                  className="font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? "Edit role" : "Add role"}
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
            <label className="block text-sm font-medium text-brand">Title</label>
            <input
              required
              placeholder="e.g. Audit Associate"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-brand">
                Department <span className="text-muted">(optional)</span>
              </label>
              <input
                placeholder="e.g. Internal Audit"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputClass}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand">
                Location <span className="text-muted">(optional)</span>
              </label>
              <input
                placeholder="e.g. New Delhi"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-2 text-sm text-brand">
              <input
                type="checkbox"
                checked={form.remote}
                onChange={(e) => setForm({ ...form, remote: e.target.checked })}
              />
              Remote
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand">Description</label>
            <textarea
              required
              rows={5}
              placeholder="Responsibilities, requirements, etc."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-brand">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published (visible on the public Open Roles page)
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : editId ? "Save changes" : "Add role"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete role">
        <p className="text-sm text-foreground">
          Delete <strong>{deleteTarget?.title}</strong>? This cannot be undone.
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
