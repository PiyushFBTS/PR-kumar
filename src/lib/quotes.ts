import { prisma } from "@/lib/prisma";

// Places a quote at a 1-based position, shifting the others, and renumbers all
// quotes to a clean 1..N sequence (so "position 1" really lands at the top).
export async function placeQuoteAt(targetId: number, desiredPos: number): Promise<void> {
  const all = await prisma.partnerQuote.findMany({
    select: { id: true },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });

  const others = all.filter((q) => q.id !== targetId).map((q) => q.id);
  const pos = Math.min(Math.max(1, desiredPos), others.length + 1);
  others.splice(pos - 1, 0, targetId);

  await prisma.$transaction(
    others.map((id, i) => prisma.partnerQuote.update({ where: { id }, data: { order: i + 1 } })),
  );
}
