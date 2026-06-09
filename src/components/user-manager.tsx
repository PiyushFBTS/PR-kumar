"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  active: boolean;
  articleCount: number;
}

const inputClass =
  "mt-1 w-full rounded border border-border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter((p) => /[A-Za-z]/.test(p))
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "U"
  );
}

export function UserManager({
  users,
  currentAdminId,
  total,
}: {
  users: ManagedUser[];
  currentAdminId: number;
  total?: number;
}) {
  const count = total ?? users.length;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Create
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "USER" });

  // Edit
  const [editUser, setEditUser] = useState<ManagedUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "USER", active: true });

  // Reset password
  const [pwUser, setPwUser] = useState<ManagedUser | null>(null);
  const [pwForm, setPwForm] = useState({ password: "", confirm: "" });

  function openCreate() {
    setCreateForm({ name: "", email: "", password: "", role: "USER" });
    setError(null);
    setCreateOpen(true);
  }
  function openEdit(u: ManagedUser) {
    setEditForm({ name: u.name, email: u.email, role: u.role, active: u.active });
    setError(null);
    setEditUser(u);
  }
  function openReset(u: ManagedUser) {
    setPwForm({ password: "", confirm: "" });
    setError(null);
    setPwUser(u);
  }

  async function send(url: string, method: string, payload: unknown): Promise<boolean> {
    setBusy(true);
    setError(null);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return false;
    }
    router.refresh();
    return true;
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    if (await send("/api/admin/users", "POST", createForm)) setCreateOpen(false);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    if (await send(`/api/admin/users/${editUser.id}`, "PATCH", editForm)) setEditUser(null);
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!pwUser) return;
    setError(null);
    if (pwForm.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (pwForm.password !== pwForm.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (await send(`/api/admin/users/${pwUser.id}`, "PATCH", { password: pwForm.password })) {
      setPwUser(null);
    }
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted">
          {count} user{count === 1 ? "" : "s"}
        </p>
        <Button size="sm" onClick={openCreate}>
          + Create user
        </Button>
      </div>

      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
        {users.map((u) => {
          const isSelf = u.id === currentAdminId;
          return (
            <li
              key={u.id}
              className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-surface"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials(u.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-brand">{u.name}</p>
                  {isSelf ? <span className="text-xs text-muted">(you)</span> : null}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                      u.role === "ADMIN"
                        ? "bg-primary/15 text-brand-accent"
                        : "border border-border text-muted"
                    }`}
                  >
                    {u.role}
                  </span>
                  <span
                    className={`text-xs font-medium ${u.active ? "text-green-700" : "text-red-600"}`}
                  >
                    {u.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {u.email} · {u.articleCount} article{u.articleCount === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => openEdit(u)}
                  className="font-medium text-brand hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => openReset(u)}
                  className="font-medium text-brand-accent hover:underline"
                >
                  Reset password
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create user">
        <form onSubmit={createUser} className="space-y-4">
          {error ? <ErrorBox msg={error} /> : null}
          <Field label="Full name">
            <input
              required
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Temporary password">
            <input
              required
              type="text"
              placeholder="At least 8 characters"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Role">
            <select
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
              className={inputClass}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </Field>
          <ModalActions
            busy={busy}
            submitLabel="Create user"
            onCancel={() => setCreateOpen(false)}
          />
        </form>
      </Modal>

      {/* Edit modal */}
      <Modal open={editUser !== null} onClose={() => setEditUser(null)} title="Edit user">
        <form onSubmit={saveEdit} className="space-y-4">
          {error ? <ErrorBox msg={error} /> : null}
          <Field label="Full name">
            <input
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Role">
            <select
              value={editForm.role}
              disabled={editUser?.id === currentAdminId}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className={`${inputClass} disabled:opacity-60`}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-brand">
            <input
              type="checkbox"
              checked={editForm.active}
              disabled={editUser?.id === currentAdminId}
              onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
            />
            Active (can sign in)
          </label>
          {editUser?.id === currentAdminId ? (
            <p className="text-xs text-muted">
              You can&apos;t change your own role or active status.
            </p>
          ) : null}
          <ModalActions busy={busy} submitLabel="Save changes" onCancel={() => setEditUser(null)} />
        </form>
      </Modal>

      {/* Reset password modal */}
      <Modal open={pwUser !== null} onClose={() => setPwUser(null)} title="Reset password">
        <form onSubmit={savePassword} className="space-y-4">
          {error ? <ErrorBox msg={error} /> : null}
          <p className="text-sm text-muted">
            Set a new password for <strong className="text-brand">{pwUser?.name}</strong>. Share it
            securely; they can change it later.
          </p>
          <Field label="New password">
            <input
              required
              type="text"
              placeholder="At least 8 characters"
              value={pwForm.password}
              onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Confirm password">
            <input
              required
              type="text"
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              className={inputClass}
            />
          </Field>
          <ModalActions busy={busy} submitLabel="Set password" onCancel={() => setPwUser(null)} />
        </form>
      </Modal>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-sm font-medium text-brand">{label}</span>
      {children}
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
      {msg}
    </p>
  );
}

function ModalActions({
  busy,
  submitLabel,
  onCancel,
}: {
  busy: boolean;
  submitLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-3 pt-2">
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : submitLabel}
      </Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
