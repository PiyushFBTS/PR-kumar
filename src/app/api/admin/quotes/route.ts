import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { json, apiError } from "@/lib/api";
import { quoteSchema } from "@/lib/validation";
import { placeQuoteAt } from "@/lib/quotes";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const quotes = await prisma.partnerQuote.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  return json({ quotes });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const body = await req.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Invalid input", 400, { issues: parsed.error.flatten().fieldErrors });
  }

  let quote;
  try {
    quote = await prisma.partnerQuote.create({
      data: { ...parsed.data, role: parsed.data.role ?? null },
    });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002") {
      return apiError("This partner already has a quote — edit the existing one instead.", 409);
    }
    throw e;
  }

  // Position the new quote (defaults to last when no/zero position given).
  await placeQuoteAt(quote.id, parsed.data.order || Number.MAX_SAFE_INTEGER);
  return json({ quote }, 201);
}
