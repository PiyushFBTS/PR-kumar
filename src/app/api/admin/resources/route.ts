import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { json, apiError } from "@/lib/api";
import { resourceSchema } from "@/lib/validation";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const resources = await prisma.resource.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  return json({ resources });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const body = await req.json().catch(() => null);
  const parsed = resourceSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Invalid input", 400, { issues: parsed.error.flatten().fieldErrors });
  }

  const resource = await prisma.resource.create({
    data: {
      ...parsed.data,
      category: parsed.data.category ?? null,
      logo: parsed.data.logo ?? null,
    },
  });
  return json({ resource }, 201);
}
