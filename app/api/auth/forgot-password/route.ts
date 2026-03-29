import { NextRequest } from "next/server";
import { z } from "zod";

import { requestPasswordReset } from "@/lib/auth";
import { handleRouteError, jsonResponse } from "@/lib/api";
import { absoluteUrl, normalizeEmail } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = forgotPasswordSchema.parse(await request.json());

    try {
      await requestPasswordReset(
        normalizeEmail(payload.email),
        absoluteUrl("/reset-password"),
      );
    } catch (error) {
      console.error("Password reset request failed", error);
    }

    return jsonResponse(
      {
        message:
          "If the account exists, a password reset link has been sent to the email address.",
      },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to process password reset");
  }
}
