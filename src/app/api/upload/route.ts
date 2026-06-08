import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { apiError, json, getClientIp } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Stores the uploaded image in the database (Media table) and returns a URL
// that serves it from there — so uploads persist on serverless hosts (Vercel).
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("Not authenticated", 401);

  if (!rateLimit(`upload:${getClientIp(req)}`, 30, 60_000).ok) {
    return apiError("Too many uploads. Please slow down.", 429);
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return apiError("No file provided", 400);

  if (!ALLOWED.has(file.type)) {
    return apiError("Unsupported image type (use JPG, PNG, WebP or GIF).", 415);
  }
  const maxBytes = env.upload.maxMb * 1024 * 1024;
  if (file.size > maxBytes) return apiError(`Image exceeds ${env.upload.maxMb}MB limit.`, 413);

  const data = Buffer.from(await file.arrayBuffer());
  const media = await prisma.media.create({
    data: { mimeType: file.type, data },
    select: { id: true },
  });

  return json({ url: `/api/media/${media.id}` }, 201);
}
