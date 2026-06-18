import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { json, apiError } from "@/lib/api";
import { resourceSchema } from "@/lib/validation";
import { placeCategory, placeResourceInCategory } from "@/lib/resource-order";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return apiError("Invalid id", 400);

  const body = await req.json().catch(() => null);
  const parsed = resourceSchema.partial().safeParse(body);
  if (!parsed.success) {
    return apiError("Invalid input", 400, { issues: parsed.error.flatten().fieldErrors });
  }

  const existing = await prisma.resource.findUnique({
    where: { id },
    select: { id: true, category: true },
  });
  if (!existing) return apiError("Not found", 404);

  const resource = await prisma.resource.update({ where: { id }, data: parsed.data });

  const cat =
    parsed.data.category !== undefined ? (parsed.data.category ?? "General") : (existing.category ?? "General");
  if (parsed.data.categoryOrder !== undefined) await placeCategory(cat, parsed.data.categoryOrder);
  if (parsed.data.order !== undefined) await placeResourceInCategory(id, cat, parsed.data.order);
  return json({ resource });
}

export async function DELETE(_req: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return apiError("Invalid id", 400);

  const existing = await prisma.resource.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return apiError("Not found", 404);

  await prisma.resource.delete({ where: { id } });
  return json({ ok: true });
}
