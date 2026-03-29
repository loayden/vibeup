import { NextRequest } from "next/server";
import { z } from "zod";

import { handleRouteError, jsonResponse } from "@/lib/api";
import {
  sendAdminNotification,
  sendEnquiryConfirmation,
} from "@/lib/email";
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

export async function POST(request: NextRequest) {
  try {
    const payload = enquirySchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data: enquiry, error } = await supabase
      .from("enquiries")
      .insert({
        name: sanitizeText(payload.name, 100),
        email: normalizeEmail(payload.email),
        phone: sanitizeOptionalText(payload.phone, 30),
        company: sanitizeOptionalText(payload.company, 120),
        event_type: payload.event_type || null,
        guest_count: sanitizeOptionalText(payload.guest_count, 50),
        event_date: payload.event_date || null,
        budget: sanitizeOptionalText(payload.budget, 100),
        message: sanitizeMultilineText(payload.message, 2000),
        source: sanitizeText(payload.source, 50),
      })
      .select("*")
      .single();

    if (error || !enquiry) {
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
    return handleRouteError(request, error, "Unable to submit enquiry");
  }
}
