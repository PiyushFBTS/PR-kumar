import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { hashPassword } from "@/lib/password";
import { json, apiError } from "@/lib/api";
import { adminUserUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/admin/users/:id — edit details (name/email/role/active) and/or
// reset the password.
export async function PATCH(req: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return apiError("Forbidden", 403);

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return apiError("Invalid id", 400);

  const body = await req.json().catch(() => null);
  const parsed = adminUserUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Invalid input", 400, { issues: parsed.error.flatten().fieldErrors });
  }

  const { name, email, role, active, password } = parsed.data;

  // Guard against an admin locking themselves out.
  if (id === admin.id) {
    if (active === false) return apiError("You cannot deactivate yourself.", 400);
    if (role === "USER") return apiError("You cannot demote yourself.", 400);
  }

  const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return apiError("Not found", 404);

  // Email must stay unique across users.
  if (email) {
    const taken = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (taken && taken.id !== id) {
      return apiError("Another account already uses this email.", 409);
    }
  }

  const data: {
    name?: string;
    email?: string;
    role?: "USER" | "ADMIN";
    active?: boolean;
    passwordHash?: string;
  } = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (role !== undefined) data.role = role;
  if (active !== undefined) data.active = active;
  if (password) data.passwordHash = await hashPassword(password);

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  return json({ user });
}
