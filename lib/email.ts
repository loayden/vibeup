import "server-only";

import { format } from "date-fns";
import { Resend } from "resend";

import { chunk } from "@/lib/utils";

const DEFAULT_FROM = "ZOYA Events <hello@vibesup.org>";
const TICKETS_FROM = "ZOYA Events <tickets@vibesup.org>";
const REMINDERS_FROM = "ZOYA Events <reminders@vibesup.org>";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(payload: Parameters<Resend["emails"]["send"]>[0]) {
  const resend = getResendClient();

  if (!resend) {
    console.warn("RESEND_API_KEY is not configured. Email skipped.");
    return;
  }

  await resend.emails.send(payload);
}

export async function sendWelcomeEmail(to: string, name: string) {
  await sendEmail({
    from: DEFAULT_FROM,
    to,
    subject: "Welcome to ZOYA Events",
    html: `
      <body style="background:#080808;color:#ffffff;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h1 style="font-family:Georgia,serif;font-weight:300;color:#C6A962;margin:0 0 16px;">Welcome, ${escapeHtml(name)}</h1>
        <p style="color:rgba(255,255,255,0.68);line-height:1.7;margin:0;">
          Your ZOYA account is ready. Explore upcoming events, manage your bookings, and discover new experiences at vibesup.org.
        </p>
      </body>
    `,
  });
}

type TicketEmailInput = {
  to: string;
  name: string;
  orderNumber: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  tickets: Array<{
    ticket_number: string;
    ticket_type_name: string;
    qr_code_url: string | null;
  }>;
  total: number;
  currency?: string;
};

export async function sendTicketEmail(input: TicketEmailInput) {
  const ticketRows = input.tickets
    .map(
      (ticket) => `
        <div style="margin:16px 0;padding:20px;border-radius:20px;border:1px solid rgba(198,169,98,0.28);background:linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02));">
          <p style="margin:0 0 8px;color:#C6A962;font-family:Georgia,serif;font-size:20px;">${escapeHtml(ticket.ticket_type_name)}</p>
          <p style="margin:0 0 16px;color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">
            ${escapeHtml(ticket.ticket_number)}
          </p>
          ${
            ticket.qr_code_url
              ? `<img src="${ticket.qr_code_url}" width="180" height="180" alt="Ticket QR code" style="display:block;border-radius:14px;border:1px solid rgba(255,255,255,0.08);" />`
              : ""
          }
        </div>
      `,
    )
    .join("");

  await sendEmail({
    from: TICKETS_FROM,
    to: input.to,
    subject: `Your tickets for ${input.eventTitle} - Order ${input.orderNumber}`,
    html: `
      <body style="background:#080808;color:#ffffff;font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:32px;">
        <div style="margin-bottom:24px;text-align:center;">
          <h1 style="margin:0;color:#C6A962;font-family:Georgia,serif;font-weight:300;font-size:34px;">ZOYA</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.34);font-size:10px;letter-spacing:0.4em;text-transform:uppercase;">Events and Services</p>
        </div>
        <div style="padding:28px;border-radius:24px;border:1px solid rgba(255,255,255,0.08);background:linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02));">
          <p style="margin:0 0 10px;color:rgba(255,255,255,0.38);font-size:10px;letter-spacing:0.38em;text-transform:uppercase;">Order Confirmed</p>
          <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:300;font-size:28px;">${escapeHtml(input.eventTitle)}</h2>
          <p style="margin:6px 0;color:rgba(255,255,255,0.68);">Guest: ${escapeHtml(input.name)}</p>
          <p style="margin:6px 0;color:rgba(255,255,255,0.68);">Date: ${escapeHtml(format(new Date(input.eventDate), "EEEE, MMMM d, yyyy 'at' p"))}</p>
          <p style="margin:6px 0;color:rgba(255,255,255,0.68);">Venue: ${escapeHtml(input.venue)}</p>
          <p style="margin:6px 0;color:rgba(255,255,255,0.68);">Order: ${escapeHtml(input.orderNumber)}</p>
          <p style="margin:18px 0 0;color:#C6A962;font-family:Georgia,serif;font-size:20px;">Total: ${escapeHtml(
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: input.currency || "USD",
            }).format(input.total),
          )}</p>
        </div>
        <div style="margin-top:24px;">${ticketRows}</div>
        <p style="margin-top:24px;color:rgba(255,255,255,0.38);font-size:12px;line-height:1.7;">
          Present the QR code for each ticket at the venue entrance. If you need support, reply to this email or contact vibesup.event@gmail.com.
        </p>
      </body>
    `,
  });
}

export async function sendEnquiryConfirmation(
  to: string,
  name: string,
  enquiryId: string,
) {
  await sendEmail({
    from: DEFAULT_FROM,
    to,
    subject: "We received your enquiry",
    html: `
      <body style="background:#080808;color:#ffffff;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h1 style="font-family:Georgia,serif;font-weight:300;color:#C6A962;margin:0 0 16px;">Thank you, ${escapeHtml(name)}</h1>
        <p style="margin:0 0 12px;color:rgba(255,255,255,0.68);line-height:1.7;">
          We received your enquiry and our team will respond within 24 hours.
        </p>
        <p style="margin:0;color:rgba(255,255,255,0.38);font-size:12px;">Reference: ${escapeHtml(enquiryId)}</p>
      </body>
    `,
  });
}

export async function sendApplicationConfirmation(
  to: string,
  name: string,
  role: string,
) {
  await sendEmail({
    from: DEFAULT_FROM,
    to,
    subject: `Application received for ${role}`,
    html: `
      <body style="background:#080808;color:#ffffff;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h1 style="font-family:Georgia,serif;font-weight:300;color:#C6A962;margin:0 0 16px;">Application received</h1>
        <p style="margin:0 0 12px;color:rgba(255,255,255,0.68);line-height:1.7;">
          Thank you, ${escapeHtml(name)}. We received your application for ${escapeHtml(role)} and will review it shortly.
        </p>
      </body>
    `,
  });
}

export async function sendEventReminder(
  to: string,
  name: string,
  event: {
    title: string;
    event_date: string;
    venue_name: string;
    venue_address?: string | null;
    dress_code?: string | null;
    parking_info?: string | null;
  },
  hoursUntil: number,
) {
  await sendEmail({
    from: REMINDERS_FROM,
    to,
    subject:
      hoursUntil === 24
        ? `Reminder: ${event.title} is tomorrow`
        : `Reminder: ${event.title} starts in ${hoursUntil} hours`,
    html: `
      <body style="background:#080808;color:#ffffff;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h1 style="font-family:Georgia,serif;font-weight:300;color:#C6A962;margin:0 0 16px;">See you soon, ${escapeHtml(name)}</h1>
        <p style="margin:0 0 10px;color:rgba(255,255,255,0.68);line-height:1.7;">${escapeHtml(event.title)} is coming up.</p>
        <p style="margin:4px 0;color:rgba(255,255,255,0.62);">Date: ${escapeHtml(format(new Date(event.event_date), "EEEE, MMMM d, yyyy 'at' p"))}</p>
        <p style="margin:4px 0;color:rgba(255,255,255,0.62);">Venue: ${escapeHtml(event.venue_name)}${event.venue_address ? `, ${escapeHtml(event.venue_address)}` : ""}</p>
        <p style="margin:4px 0;color:rgba(255,255,255,0.62);">Dress code: ${escapeHtml(event.dress_code || "Smart Casual")}</p>
        <p style="margin:4px 0;color:rgba(255,255,255,0.62);">Parking: ${escapeHtml(event.parking_info || "Parking available at venue")}</p>
      </body>
    `,
  });
}

export async function sendAdminNotification(
  subject: string,
  html: string,
  to = "vibesup.event@gmail.com",
) {
  await sendEmail({
    from: DEFAULT_FROM,
    to,
    subject,
    html,
  });
}

export async function sendBulkEmail({
  recipients,
  subject,
  html,
}: {
  recipients: string[];
  subject: string;
  html: string;
}) {
  const resend = getResendClient();

  if (!resend) {
    console.warn("RESEND_API_KEY is not configured. Bulk email skipped.");
    return { sent: 0, failed: recipients.length };
  }

  let sent = 0;
  let failed = 0;

  for (const group of chunk(recipients, 20)) {
    const results = await Promise.allSettled(
      group.map((email) =>
        resend.emails.send({
          from: DEFAULT_FROM,
          to: email,
          subject,
          html,
        }),
      ),
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        sent += 1;
      } else {
        failed += 1;
      }
    }
  }

  return { sent, failed };
}
