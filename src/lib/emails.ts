import { sendMail, type MailAttachment } from "@/lib/email";
import { env } from "@/lib/env";

const FIRM = "P. R. Kumar & Co.";
const site = env.siteUrl;

// All helpers are best-effort: email failures are logged but never throw,
// so a transient SMTP problem can't break the request flow.
async function safeSend(to: string, subject: string, html: string, attachments?: MailAttachment[]) {
  try {
    await sendMail({ to, subject, html, attachments });
  } catch (err) {
    console.warn("[email] send failed:", (err as Error).message);
  }
}

export async function notifyAdminOfSubmission(opts: {
  articleId: number;
  title: string;
  authorName: string;
}) {
  await safeSend(
    env.mail.toFirm,
    `New article submitted for review: ${opts.title}`,
    `<p>A new article has been submitted for review.</p>
     <p><strong>${opts.title}</strong> — by ${opts.authorName}</p>
     <p><a href="${site}/admin/approvals">Open the approval queue</a></p>
     <p>— ${FIRM} website</p>`,
  );
}

export async function notifyAuthorApproved(opts: {
  to: string;
  authorName: string;
  title: string;
  slug: string;
}) {
  await safeSend(
    opts.to,
    `Your article was approved: ${opts.title}`,
    `<p>Hi ${opts.authorName},</p>
     <p>Good news — your article <strong>${opts.title}</strong> has been approved and is now live.</p>
     <p><a href="${site}/thought-leadership/blogs/${opts.slug}">View it on the site</a></p>
     <p>— ${FIRM}</p>`,
  );
}

export async function notifyAuthorRejected(opts: {
  to: string;
  authorName: string;
  title: string;
  reason: string;
}) {
  await safeSend(
    opts.to,
    `Update on your article: ${opts.title}`,
    `<p>Hi ${opts.authorName},</p>
     <p>Your article <strong>${opts.title}</strong> was not approved at this time.</p>
     <p><strong>Reason:</strong> ${opts.reason}</p>
     <p>You can edit and resubmit it from <a href="${site}/account/articles">My Articles</a>.</p>
     <p>— ${FIRM}</p>`,
  );
}

export async function notifyFirmOfEnquiry(opts: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  await safeSend(
    env.mail.toFirm,
    `New enquiry: ${opts.service}`,
    `<p>A new enquiry has been submitted via the website.</p>
     <p><strong>Name:</strong> ${opts.name}<br/>
        <strong>Email:</strong> ${opts.email}<br/>
        <strong>Contact number:</strong> ${opts.phone}<br/>
        <strong>Service:</strong> ${opts.service}</p>
     <p><strong>Message:</strong><br/>${opts.message}</p>`,
  );
}

export async function ackEnquiry(opts: { to: string; name: string }) {
  await safeSend(
    opts.to,
    `We've received your enquiry — ${FIRM}`,
    `<p>Hi ${opts.name},</p>
     <p>Thank you for contacting ${FIRM}. We've received your enquiry and will get back to you shortly.</p>
     <p>— ${FIRM}</p>`,
  );
}

export async function notifyFirmOfApplication(opts: {
  name: string;
  email: string;
  phone: string;
  applyType: string;
  hasResume: boolean;
  resume?: MailAttachment;
}) {
  await safeSend(
    env.mail.toFirm,
    `New ${opts.applyType.toLowerCase()} application: ${opts.name}`,
    `<p>A new career application has been submitted.</p>
     <p><strong>Type:</strong> ${opts.applyType}<br/>
        <strong>Name:</strong> ${opts.name}<br/>
        <strong>Email:</strong> ${opts.email}<br/>
        <strong>Phone:</strong> ${opts.phone}<br/>
        <strong>Resume attached:</strong> ${opts.hasResume ? "Yes" : "No"}</p>
     <p><a href="${site}/admin/careers">View applications</a></p>`,
    opts.resume ? [opts.resume] : undefined,
  );
}

export async function ackApplication(opts: { to: string; name: string; applyType: string }) {
  await safeSend(
    opts.to,
    `Application received — ${FIRM}`,
    `<p>Hi ${opts.name},</p>
     <p>Thank you for your ${opts.applyType.toLowerCase()} application to ${FIRM}. Our team will review it and be in touch if there's a fit.</p>
     <p>— ${FIRM}</p>`,
  );
}
