import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { json, apiError } from "@/lib/api";
import { resourceSchema } from "@/lib/validation";
import { placeCategory, placeResourceInCategory } from "@/lib/resource-order";

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

  const cat = parsed.data.category ?? "General";
  await placeCategory(cat, parsed.data.categoryOrder || Number.MAX_SAFE_INTEGER);
  await placeResourceInCategory(resource.id, cat, parsed.data.order || Number.MAX_SAFE_INTEGER);
  return json({ resource }, 201);
}
