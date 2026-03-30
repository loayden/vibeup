import { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import {
  sendAdminNotification,
  sendEnquiryConfirmation,
} from "@/lib/email";
import { isBackupEligibleSupabaseError } from "@/lib/supabase-errors";
import { createAdminClient } from "@/lib/supabase-server";
import {
  normalizeEmail,
  sanitizeMultilineText,
  sanitizeOptionalText,
  sanitizeText,
} from "@/lib/utils";

const enquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  company: z.string().max(120).optional().nullable(),
  event_type: z
    .enum(["corporate", "private", "concert", "cultural", "wedding", "other"])
    .optional()
    .nullable(),
  guest_count: z.string().max(50).optional().nullable(),
  event_date: z.string().optional().nullable(),
  budget: z.string().max(100).optional().nullable(),
  message: z.string().min(10).max(2000),
  source: z.string().max(50).default("website"),
});

type EnquiryInput = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  eventType: string | null;
  guestCount: string | null;
  eventDate: string | null;
  budget: string | null;
  message: string;
  source: string;
};

function normalizeEnquiryInput(payload: z.infer<typeof enquirySchema>): EnquiryInput {
  return {
    name: sanitizeText(payload.name, 100),
    email: normalizeEmail(payload.email),
    phone: sanitizeOptionalText(payload.phone, 30),
    company: sanitizeOptionalText(payload.company, 120),
    eventType: payload.event_type || null,
    guestCount: sanitizeOptionalText(payload.guest_count, 50),
    eventDate: payload.event_date || null,
    budget: sanitizeOptionalText(payload.budget, 100),
    message: sanitizeMultilineText(payload.message, 2000),
    source: sanitizeText(payload.source, 50),
  };
}

function buildEnquiryBackupHtml(input: EnquiryInput) {
  return `
    <body style="background:#080808;color:#ffffff;font-family:Arial,sans-serif;padding:24px;">
      <h1 style="font-family:Georgia,serif;font-weight:300;color:#C6A962;margin:0 0 16px;">
        Enquiry backup received
      </h1>
      <p style="margin:0 0 8px;color:rgba(255,255,255,0.72);">
        Supabase was unavailable, so this enquiry was captured through the backup channel.
      </p>
      <p style="margin:16px 0 4px;color:rgba(255,255,255,0.72);"><strong>Name:</strong> ${input.name}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Email:</strong> ${input.email}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Phone:</strong> ${input.phone || "Not provided"}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Company:</strong> ${input.company || "Not provided"}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Event type:</strong> ${input.eventType || "Not provided"}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Guest count:</strong> ${input.guestCount || "Not provided"}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Event date:</strong> ${input.eventDate || "Not provided"}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Budget:</strong> ${input.budget || "Not provided"}</p>
      <div style="margin-top:18px;">
        <p style="margin:0 0 10px;color:#C6A962;"><strong>Message</strong></p>
        <p style="margin:0;color:rgba(255,255,255,0.72);white-space:pre-wrap;">${input.message}</p>
      </div>
    </body>
  `;
}

async function sendEnquiryBackup(input: EnquiryInput) {
  if (!process.env.RESEND_API_KEY) {
    return false;
  }

  try {
    await sendAdminNotification(
      `Enquiry backup from ${input.name}`,
      buildEnquiryBackupHtml(input),
    );
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = enquirySchema.parse(await request.json());
    const input = normalizeEnquiryInput(payload);
    const supabase = createAdminClient();

    const { data: enquiry, error } = await supabase
      .from("enquiries")
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        event_type: input.eventType,
        guest_count: input.guestCount,
        event_date: input.eventDate,
        budget: input.budget,
        message: input.message,
        source: input.source,
      })
      .select("*")
      .single();

    if (error || !enquiry) {
      if (isBackupEligibleSupabaseError(error)) {
        const backupSent = await sendEnquiryBackup(input);

        if (backupSent) {
          return jsonResponse(
            {
              message:
                "Enquiry received through the backup channel. Our team will respond within 24 hours.",
            },
            {
              status: 201,
              origin: request.headers.get("origin"),
            },
          );
        }

        return errorResponse(
          "Enquiry delivery failed because Supabase is unavailable and email backup is not configured.",
          500,
          {
            origin: request.headers.get("origin"),
          },
        );
      }

      throw error || new Error("Failed to create enquiry");
    }

    try {
      await Promise.all([
        sendEnquiryConfirmation(enquiry.email, enquiry.name, enquiry.id),
        sendAdminNotification(
          `New enquiry from ${enquiry.name}`,
          `
            <body style="background:#080808;color:#ffffff;font-family:Arial,sans-serif;padding:24px;">
              <h1 style="font-family:Georgia,serif;font-weight:300;color:#C6A962;">New enquiry received</h1>
              <pre style="white-space:pre-wrap;color:rgba(255,255,255,0.72);font-size:14px;">${JSON.stringify(enquiry, null, 2)}</pre>
            </body>
          `,
        ),
      ]);
    } catch (emailError) {
      console.error("Enquiry email delivery failed", emailError);
    }

    return jsonResponse(
      {
        message: "Enquiry submitted successfully",
        id: enquiry.id,
      },
      {
        status: 201,
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    if (isBackupEligibleSupabaseError(error)) {
      return errorResponse(
        "Enquiry delivery failed because Supabase is unavailable and email backup is not configured.",
        500,
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    return handleRouteError(request, error, "Unable to submit enquiry");
  }
}
