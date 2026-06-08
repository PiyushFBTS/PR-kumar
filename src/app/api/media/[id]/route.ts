import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

// Serves an uploaded image stored in the DB. Immutable + cacheable since the
// id is content-unique (new upload → new id).
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const media = await prisma.media.findUnique({
    where: { id },
    select: { mimeType: true, data: true },
  });
  if (!media) return apiError("Not found", 404);

  return new Response(Buffer.from(media.data), {
    headers: {
      "Content-Type": media.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
