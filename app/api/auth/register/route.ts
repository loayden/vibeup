import { NextRequest } from "next/server";
import { z } from "zod";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { sendWelcomeEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase-server";
import { normalizeEmail, sanitizeText } from "@/lib/utils";

const registerSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter and one number",
    ),
  marketing_opt_in: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const payload = registerSchema.parse(await request.json());
    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.createUser({
      email: normalizeEmail(payload.email),
      password: payload.password,
      email_confirm: false,
      user_metadata: {
        full_name: sanitizeText(payload.full_name, 100),
        marketing_opt_in: payload.marketing_opt_in,
      },
    });

    if (error || !data.user) {
      return errorResponse(error?.message || "Registration failed", 400, {
        origin: request.headers.get("origin"),
      });
    }

    await supabase
      .from("profiles")
      .update({
        full_name: sanitizeText(payload.full_name, 100),
        marketing_opt_in: payload.marketing_opt_in,
      })
      .eq("id", data.user.id);

    try {
      await sendWelcomeEmail(
        normalizeEmail(payload.email),
        sanitizeText(payload.full_name, 100),
      );
    } catch (emailError) {
      console.error("Failed to send welcome email", emailError);
    }

    return jsonResponse(
      {
        message: "Account created. Please verify your email.",
        user_id: data.user.id,
      },
      {
        status: 201,
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Registration failed");
  }
}
