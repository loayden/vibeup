import { NextRequest } from "next/server";
import { z } from "zod";

import { resetPasswordWithRecoveryToken } from "@/lib/auth";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";

const resetPasswordSchema = z.object({
  token_hash: z.string().min(1),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter and one number",
    ),
});

export async function POST(request: NextRequest) {
  try {
    const payload = resetPasswordSchema.parse(await request.json());
    const result = await resetPasswordWithRecoveryToken(
      payload.token_hash,
      payload.password,
    );

    if (result.error) {
      return errorResponse(result.error.message, 400, {
        origin: request.headers.get("origin"),
      });
    }

    return jsonResponse(
      { message: "Password updated successfully" },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to reset password");
  }
}
