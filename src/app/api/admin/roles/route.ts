import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { json, apiError } from "@/lib/api";
import { jobPostingSchema } from "@/lib/validation";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const roles = await prisma.jobPosting.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return json({ roles });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const body = await req.json().catch(() => null);
  const parsed = jobPostingSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Invalid input", 400, { issues: parsed.error.flatten().fieldErrors });
  }

  const role = await prisma.jobPosting.create({
    data: {
      ...parsed.data,
      department: parsed.data.department ?? null,
      location: parsed.data.location ?? null,
    },
  });
  return json({ role }, 201);
}
