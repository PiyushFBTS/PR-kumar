import { recordView } from "@/lib/analytics";
import { json, getClientIp } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Records a raw page view. Public — fires for every visitor (logged in or not).
// Non-public areas (admin/account/auth/api) are not counted.
const IGNORE = /^\/(admin|account|api|login)(\/|$)/;

export async function POST(req: Request) {
  // Generous per-IP cap to avoid abuse without undercounting real browsing.
  if (!rateLimit(`track:${getClientIp(req)}`, 120, 60_000).ok) {
    return json({ ok: true });
  }

  const body = await req.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path : "";
  if (!path || IGNORE.test(path)) return json({ ok: true });

  await recordView();
  return json({ ok: true });
}
