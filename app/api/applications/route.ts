import { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import {
  sendAdminNotification,
  sendApplicationConfirmation,
} from "@/lib/email";
import { saveLeadBackupToReservations } from "@/lib/lead-backups";
import { isBackupEligibleSupabaseError } from "@/lib/supabase-errors";
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

type ApplicationInput = {
  name: string;
  email: string;
  phone: string | null;
  role: string;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  resumeUrl: string | null;
  message: string | null;
};

function normalizeApplicationInput(
  payload: z.infer<typeof applicationSchema>,
): ApplicationInput {
  return {
    name: sanitizeText(payload.name, 100),
    email: normalizeEmail(payload.email),
    phone: sanitizeOptionalText(payload.phone, 30),
    role: sanitizeText(payload.role, 120),
    portfolioUrl: payload.portfolio_url || null,
    linkedinUrl: payload.linkedin_url || null,
    resumeUrl: payload.resume_url || null,
    message: payload.message ? sanitizeMultilineText(payload.message, 2000) : null,
  };
}

function buildApplicationBackupHtml(input: ApplicationInput) {
  return `
    <body style="background:#080808;color:#ffffff;font-family:Arial,sans-serif;padding:24px;">
      <h1 style="font-family:Georgia,serif;font-weight:300;color:#C6A962;margin:0 0 16px;">
        Career application backup received
      </h1>
      <p style="margin:0 0 8px;color:rgba(255,255,255,0.72);">
        Supabase was unavailable, so this application was captured through the backup channel.
      </p>
      <p style="margin:16px 0 4px;color:rgba(255,255,255,0.72);"><strong>Name:</strong> ${input.name}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Email:</strong> ${input.email}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Phone:</strong> ${input.phone || "Not provided"}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Role:</strong> ${input.role}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Portfolio:</strong> ${input.portfolioUrl || "Not provided"}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>LinkedIn:</strong> ${input.linkedinUrl || "Not provided"}</p>
      <p style="margin:4px 0;color:rgba(255,255,255,0.72);"><strong>Resume:</strong> ${input.resumeUrl || "Not provided"}</p>
      <div style="margin-top:18px;">
        <p style="margin:0 0 10px;color:#C6A962;"><strong>Message</strong></p>
        <p style="margin:0;color:rgba(255,255,255,0.72);white-space:pre-wrap;">${input.message || "Not provided"}</p>
      </div>
    </body>
  `;
}

async function sendApplicationBackup(input: ApplicationInput) {
  if (!process.env.RESEND_API_KEY) {
    return false;
  }

  try {
    await sendAdminNotification(
      `Application backup for ${input.role}`,
      buildApplicationBackupHtml(input),
    );
    return true;
  } catch {
    return false;
  }
}

async function persistApplicationFallback(input: ApplicationInput) {
  const emailBackupSent = await sendApplicationBackup(input);

  if (emailBackupSent) {
    return true;
  }

  const details = [
    `role: ${input.role}`,
    `phone: ${input.phone || "not provided"}`,
    `portfolio: ${input.portfolioUrl || "not provided"}`,
    `linkedin: ${input.linkedinUrl || "not provided"}`,
    `resume: ${input.resumeUrl || "not provided"}`,
    `message: ${input.message || "not provided"}`,
  ].join("\n");

  const backup = await saveLeadBackupToReservations({
    category: "application",
    email: input.email,
    fullName: input.name,
    title: input.role,
    details,
  });

  return backup.success;
}

export async function POST(request: NextRequest) {
  let input: ApplicationInput | null = null;

  try {
    const payload = applicationSchema.parse(await request.json());
    input = normalizeApplicationInput(payload);
    const supabase = createAdminClient();

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: input.role,
        portfolio_url: input.portfolioUrl,
        linkedin_url: input.linkedinUrl,
        message: input.message,
        resume_url: input.resumeUrl,
      })
      .select("*")
      .single();

    if (error || !application) {
      if (isBackupEligibleSupabaseError(error)) {
        const backupSent = await persistApplicationFallback(input);

        if (backupSent) {
          return jsonResponse(
            {
              message:
                "Application received successfully. Our team will review it and follow up shortly.",
            },
            {
              status: 201,
              origin: request.headers.get("origin"),
            },
          );
        }

        return errorResponse(
          "Application delivery failed because Supabase is unavailable and email backup is not configured.",
          500,
          {
            origin: request.headers.get("origin"),
          },
        );
      }

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
    if (isBackupEligibleSupabaseError(error) && input) {
      const backupSent = await persistApplicationFallback(input);

      if (backupSent) {
        return jsonResponse(
          {
            message:
              "Application received successfully. Our team will review it and follow up shortly.",
          },
          {
            status: 201,
            origin: request.headers.get("origin"),
          },
        );
      }

      return errorResponse(
        "Application delivery failed because Supabase is unavailable and email backup is not configured.",
        500,
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    return handleRouteError(request, error, "Unable to submit application");
  }
}
