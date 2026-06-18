"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Generic admin delete: DELETEs the given endpoint after confirmation.
export function RowDeleteButton({
  endpoint,
  confirmText = "Delete this item? This cannot be undone.",
}: {
  endpoint: string;
  confirmText?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    await fetch(endpoint, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
