import { NextRequest } from "next/server";
import { z } from "zod";

import { handleRouteError, jsonResponse } from "@/lib/api";
import {
  sendAdminNotification,
  sendApplicationConfirmation,
} from "@/lib/email";
import { createAdminClient } from "@/lib/supabase-server";
import {
  normalizeEmail,
  sanitizeMultilineText,
  sanitizeOptionalText,
  sanitizeText,
} from "@/lib/utils";

const applicationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  role: z.string().min(2).max(120),
  portfolio_url: z.string().url().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  resume_url: z.string().url().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = applicationSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        name: sanitizeText(payload.name, 100),
        email: normalizeEmail(payload.email),
        phone: sanitizeOptionalText(payload.phone, 30),
        role: sanitizeText(payload.role, 120),
        portfolio_url: payload.portfolio_url || null,
        linkedin_url: payload.linkedin_url || null,
        message: payload.message
          ? sanitizeMultilineText(payload.message, 2000)
          : null,
        resume_url: payload.resume_url || null,
      })
      .select("*")
      .single();

    if (error || !application) {
      throw error || new Error("Failed to create application");
    }

    try {
      await Promise.all([
        sendApplicationConfirmation(
          application.email,
          application.name,
          application.role,
        ),
        sendAdminNotification(
          `New application for ${application.role}`,
          `
            <body style="background:#080808;color:#ffffff;font-family:Arial,sans-serif;padding:24px;">
              <h1 style="font-family:Georgia,serif;font-weight:300;color:#C6A962;">New career application</h1>
              <pre style="white-space:pre-wrap;color:rgba(255,255,255,0.72);font-size:14px;">${JSON.stringify(application, null, 2)}</pre>
            </body>
          `,
        ),
      ]);
    } catch (emailError) {
      console.error("Application email delivery failed", emailError);
    }

    return jsonResponse(
      {
        message: "Application submitted successfully",
        id: application.id,
      },
      {
        status: 201,
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to submit application");
  }
}
