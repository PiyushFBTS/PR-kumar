import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/password";
import { changePasswordSchema } from "@/lib/validation";
import { json, apiError, getClientIp } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";

// POST /api/auth/password — change the signed-in user's password.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("Not authenticated", 401);

  if (!rateLimit(`password:${getClientIp(req)}`, 10, 60_000).ok) {
    return apiError("Too many attempts. Please try again shortly.", 429);
  }

  const body = await req.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Invalid input", 400, { issues: parsed.error.flatten().fieldErrors });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (!dbUser) return apiError("Not found", 404);

  const ok = await verifyPassword(parsed.data.currentPassword, dbUser.passwordHash);
  if (!ok) return apiError("Current password is incorrect.", 400);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });

  return json({ ok: true });
}
