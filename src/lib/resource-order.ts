import { prisma } from "@/lib/prisma";

const norm = (c: string | null | undefined) => c?.trim() || "General";

// Reindex the category groups' `categoryOrder` to 1..M, placing `category`
// at the given 1-based vertical position (and shifting the others).
export async function placeCategory(category: string, pos: number): Promise<void> {
  const rows = await prisma.resource.findMany({
    select: { id: true, category: true },
    orderBy: [{ categoryOrder: "asc" }, { id: "asc" }],
  });

  const cats: string[] = [];
  for (const r of rows) {
    const c = norm(r.category);
    if (!cats.includes(c)) cats.push(c);
  }

  const target = norm(category);
  const without = cats.filter((c) => c !== target);
  const p = Math.min(Math.max(1, pos), without.length + 1);
  without.splice(p - 1, 0, target);

  const orderByCat = new Map(without.map((c, i) => [c, i + 1]));
  await prisma.$transaction(
    rows.map((r) =>
      prisma.resource.update({
        where: { id: r.id },
        data: { categoryOrder: orderByCat.get(norm(r.category)) ?? 1 },
      }),
    ),
  );
}

// Reindex `order` within a single category to 1..K, placing the target at the
// given 1-based horizontal position (and shifting the others in that category).
export async function placeResourceInCategory(
  targetId: number,
  category: string,
  pos: number,
): Promise<void> {
  const target = norm(category);
  const rows = await prisma.resource.findMany({
    select: { id: true, category: true },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });

  const ids = rows.filter((r) => norm(r.category) === target && r.id !== targetId).map((r) => r.id);
  const p = Math.min(Math.max(1, pos), ids.length + 1);
  ids.splice(p - 1, 0, targetId);

  await prisma.$transaction(
    ids.map((id, i) => prisma.resource.update({ where: { id }, data: { order: i + 1 } })),
  );
}
