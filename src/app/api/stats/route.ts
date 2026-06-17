import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export const runtime = "nodejs";

// Public: total all-time visits (used by the footer counter).
export async function GET() {
  const agg = await prisma.dailyView.aggregate({ _sum: { count: true } });
  return json({ visits: agg._sum.count ?? 0 });
}
