import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { json, apiError } from "@/lib/api";
import { quoteSchema } from "@/lib/validation";
import { placeQuoteAt } from "@/lib/quotes";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return apiError("Invalid id", 400);

  const body = await req.json().catch(() => null);
  const parsed = quoteSchema.partial().safeParse(body);
  if (!parsed.success) {
    return apiError("Invalid input", 400, { issues: parsed.error.flatten().fieldErrors });
  }

  const existing = await prisma.partnerQuote.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return apiError("Not found", 404);

  let quote;
  try {
    quote = await prisma.partnerQuote.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002") {
      return apiError("Another quote already uses this partner name.", 409);
    }
    throw e;
  }

  // If a position was provided (edit form), re-place and renumber.
  if (typeof parsed.data.order === "number") {
    await placeQuoteAt(id, parsed.data.order);
  }
  return json({ quote });
}

export async function DELETE(_req: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return apiError("Invalid id", 400);

  const existing = await prisma.partnerQuote.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return apiError("Not found", 404);

  await prisma.partnerQuote.delete({ where: { id } });
  return json({ ok: true });
}
