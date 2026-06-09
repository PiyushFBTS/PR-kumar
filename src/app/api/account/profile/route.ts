import { prisma } from "@/lib/prisma";
import { getCurrentUser, createSession } from "@/lib/session";
import { json, apiError } from "@/lib/api";
import { profileUpdateSchema } from "@/lib/validation";

// PATCH /api/account/profile — update the signed-in user's own name.
export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("Not authenticated", 401);

  const body = await req.json().catch(() => null);
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Invalid input", 400, { issues: parsed.error.flatten().fieldErrors });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
    select: { id: true, name: true, email: true, role: true },
  });

  // Re-issue the session so the new name is reflected in the cookie/menu.
  await createSession(updated);
  return json({ user: updated });
}
