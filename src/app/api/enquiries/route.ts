import { prisma } from "@/lib/prisma";
import { json, apiError, getClientIp } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { enquirySchema } from "@/lib/validation";
import { notifyFirmOfEnquiry, ackEnquiry } from "@/lib/emails";

// POST /api/enquiries — public contact form.
export async function POST(req: Request) {
  if (!rateLimit(`enquiry:${getClientIp(req)}`, 5, 60_000).ok) {
    return apiError("Too many submissions. Please try again shortly.", 429);
  }

  const body = await req.json().catch(() => null);

  // Honeypot: real users never fill this hidden field. Pretend success.
  if (body && typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Invalid input", 400, { issues: parsed.error.flatten().fieldErrors });
  }

  const { name, email, phone, service, message } = parsed.data;
  await prisma.enquiry.create({ data: { name, email, phone, service, message } });

  await notifyFirmOfEnquiry({ name, email, phone, service, message });
  await ackEnquiry({ to: email, name });

  return json({ ok: true }, 201);
}
