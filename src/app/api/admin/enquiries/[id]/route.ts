import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { json, apiError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

// DELETE /api/admin/enquiries/:id — remove a contact enquiry.
export async function DELETE(_req: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return apiError("Invalid id", 400);

  await prisma.enquiry.delete({ where: { id } }).catch(() => null);
  return json({ ok: true });
}
