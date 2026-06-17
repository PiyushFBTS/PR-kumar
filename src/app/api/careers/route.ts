import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { json, apiError, getClientIp } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { jobApplicationSchema } from "@/lib/validation";
import { notifyFirmOfApplication, ackApplication } from "@/lib/emails";
import { env } from "@/lib/env";

export const runtime = "nodejs";

// Resumes are PII → stored OUTSIDE public/, served via an admin-only route.
const RESUME_DIR = path.join(process.cwd(), "private-uploads", "resumes");
const ALLOWED_RESUME = new Map([
  ["application/pdf", "pdf"],
  ["application/msword", "doc"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
]);

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v : "";
}

export async function POST(req: Request) {
  if (!rateLimit(`careers:${getClientIp(req)}`, 5, 60_000).ok) {
    return apiError("Too many submissions. Please try again shortly.", 429);
  }

  const form = await req.formData().catch(() => null);
  if (!form) return apiError("Invalid form data", 400);

  // Honeypot.
  if (str(form, "website").trim() !== "") return json({ ok: true });

  const hasExperience = str(form, "hasExperience") === "true";
  const candidate = {
    applyType: str(form, "applyType"),
    role: str(form, "role"),
    name: str(form, "name"),
    email: str(form, "email"),
    phone: str(form, "phone"),
    hasExperience,
    experience: hasExperience
      ? {
          company: str(form, "expCompany"),
          years: str(form, "expYears"),
          role: str(form, "expRole"),
        }
      : null,
    coverNote: str(form, "coverNote"),
  };

  const parsed = jobApplicationSchema.safeParse(candidate);
  if (!parsed.success) {
    return apiError("Invalid input", 400, { issues: parsed.error.flatten().fieldErrors });
  }

  const { applyType, role, name, email, phone, experience, coverNote } = parsed.data;

  // Optional resume — stored on disk (admin download) AND attached to the
  // notification email sent to the firm.
  let resumePath: string | null = null;
  let resumeAttachment: { filename: string; content: Buffer; contentType?: string } | undefined;
  const file = form.get("resume");
  if (file instanceof File && file.size > 0) {
    const ext = ALLOWED_RESUME.get(file.type);
    if (!ext) return apiError("Resume must be a PDF, DOC or DOCX.", 415);
    if (file.size > env.upload.maxMb * 1024 * 1024) {
      return apiError(`Resume exceeds ${env.upload.maxMb}MB limit.`, 413);
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const stored = `${randomUUID()}.${ext}`;
    await mkdir(RESUME_DIR, { recursive: true });
    await writeFile(path.join(RESUME_DIR, stored), buf);
    resumePath = stored; // store filename only
    resumeAttachment = {
      filename: `${name.replace(/[^a-z0-9]+/gi, "_")}_resume.${ext}`,
      content: buf,
      contentType: file.type,
    };
  }

  await prisma.jobApplication.create({
    data: {
      applyType,
      role: role || null,
      name,
      email,
      phone,
      hasExperience,
      experience: experience ?? undefined,
      coverNote,
      resume: resumePath,
    },
  });

  await notifyFirmOfApplication({
    name,
    email,
    phone,
    applyType,
    role: role || null,
    hasResume: resumePath !== null,
    resume: resumeAttachment,
  });
  await ackApplication({ to: email, name, applyType });

  return json({ ok: true }, 201);
}
