"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export interface ManagedResource {
  id: number;
  label: string;
  url: string;
  logo: string | null;
  category: string | null;
  categoryOrder: number;
  order: number;
}

export interface CategoryMeta {
  name: string;
  position: number;
  count: number;
}

const emptyForm = { label: "", url: "", category: "", logo: "", categoryOrder: 1, order: 1 };
const inputClass =
  "mt-1 w-full rounded border border-border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

export function ResourceManager({
  resources,
  total,
  categoryMeta = [],
  nextCategoryPosition = 1,
}: {
  resources: ManagedResource[];
  total?: number;
  categoryMeta?: CategoryMeta[];
  nextCategoryPosition?: number;
}) {
  const count = total ?? resources.length;
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<ManagedResource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  function openAdd() {
    setForm({ ...emptyForm, categoryOrder: nextCategoryPosition, order: 1 });
    setEditId(null);
    setError(null);
    setFormOpen(true);
  }

  function openEdit(r: ManagedResource) {
    setForm({
      label: r.label,
      url: r.url,
      category: r.category ?? "",
      logo: r.logo ?? "",
      categoryOrder: r.categoryOrder || 1,
      order: r.order || 1,
    });
    setEditId(r.id);
    setError(null);
    setFormOpen(true);
  }

  // When the category changes, suggest sensible positions: an existing category
  // keeps its vertical slot and appends at the end horizontally; a new category
  // goes last vertically.
  function onCategoryChange(value: string) {
    const match = categoryMeta.find((c) => c.name.toLowerCase() === value.trim().toLowerCase());
    setForm((f) => ({
      ...f,
      category: value,
      categoryOrder: match ? match.position : nextCategoryPosition,
      order: editId ? f.order : match ? match.count + 1 : 1,
    }));
  }

  async function onPickLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Logo upload failed.");
        return;
      }
      setForm((f) => ({ ...f, logo: data.url }));
    } catch {
      setError("Logo upload failed.");
    } finally {
      setUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      label: form.label,
      url: form.url,
      category: form.category || null,
      logo: form.logo || null,
      categoryOrder: form.categoryOrder,
      order: form.order,
    };
    const res = await fetch(editId ? `/api/admin/resources/${editId}` : "/api/admin/resources", {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save resource.");
      return;
    }
    setFormOpen(false);
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    await fetch(`/api/admin/resources/${deleteTarget.id}`, { method: "DELETE" });
    setBusy(false);
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted">
          {count} resource{count === 1 ? "" : "s"}
        </p>
        <Button size="sm" onClick={openAdd}>
          + Add resource
        </Button>
      </div>

      {/* List */}
      {resources.length === 0 ? (
        <p className="mt-4 rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
          No resources yet. Click “Add resource” to create one.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
          {resources.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-surface"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-background">
                {r.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.logo} alt="" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-[9px] text-muted">—</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-brand">{r.label}</p>
                  {r.category ? (
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                      {r.category}
                    </span>
                  ) : null}
                  <span
                    className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-brand-accent"
                    title="Label position · position within label"
                  >
                    L{r.categoryOrder}·{r.order}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{r.url}</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
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
        title={editId ? "Edit resource" : "Add resource"}
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
            <label htmlFor="res-label" className="block text-sm font-medium text-brand">
              Label
            </label>
            <input
              id="res-label"
              required
              placeholder="e.g. MCA"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="res-url" className="block text-sm font-medium text-brand">
              URL
            </label>
            <input
              id="res-url"
              required
              type="url"
              placeholder="https://…"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="res-category" className="block text-sm font-medium text-brand">
              Category / label
            </label>
            <input
              id="res-category"
              list="resource-categories"
              placeholder="e.g. Regulatory"
              value={form.category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={inputClass}
            />
            <datalist id="resource-categories">
              {categoryMeta.map((c) => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-brand">Label position</label>
              <input
                type="number"
                min={1}
                value={form.categoryOrder}
                onChange={(e) =>
                  setForm({ ...form, categoryOrder: Math.max(1, Number(e.target.value) || 1) })
                }
                className={inputClass}
              />
              <p className="mt-1 text-xs text-muted">Vertical order of this category (1 = top).</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand">Position within label</label>
              <input
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Math.max(1, Number(e.target.value) || 1) })}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-muted">Left-to-right order in the category.</p>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-brand">Logo</span>

            {/* Preview of the added image */}
            <div className="mt-1 flex h-40 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface p-3">
              {uploading ? (
                <span className="text-sm text-muted">Uploading…</span>
              ) : form.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.logo}
                  alt="Logo preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-sm text-muted">No logo selected</span>
              )}
            </div>

            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={onPickLogo}
              className="hidden"
            />
            <div className="mt-2 flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading…" : form.logo ? "Change image" : "Upload image"}
              </Button>
              {form.logo ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setForm({ ...form, logo: "" })}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={busy || uploading}>
              {busy ? "Saving…" : editId ? "Save changes" : "Add resource"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete resource"
      >
        <p className="text-sm text-foreground">
          Delete <strong>{deleteTarget?.label}</strong>? This cannot be undone.
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
