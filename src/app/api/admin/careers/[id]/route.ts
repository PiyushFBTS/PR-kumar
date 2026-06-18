import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { json, apiError } from "@/lib/api";

export const runtime = "nodejs";

const RESUME_DIR = path.join(process.cwd(), "private-uploads", "resumes");

type Params = { params: Promise<{ id: string }> };

// DELETE /api/admin/careers/:id — remove an application (and its résumé file).
export async function DELETE(_req: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return apiError("Invalid id", 400);

  const application = await prisma.jobApplication.findUnique({
    where: { id },
    select: { resume: true },
  });
  if (!application) return apiError("Not found", 404);

  await prisma.jobApplication.delete({ where: { id } });
  if (application.resume) {
    await unlink(path.join(RESUME_DIR, path.basename(application.resume))).catch(() => {});
  }
  return json({ ok: true });
}
