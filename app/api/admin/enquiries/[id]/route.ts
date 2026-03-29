import { NextRequest } from "next/server";
import { z } from "zod";

import { requireStaff } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";
import { sanitizeOptionalText } from "@/lib/utils";

const schema = z.object({
  status: z
    .enum(["new", "in_review", "quoted", "booked", "closed", "spam"])
    .optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireStaff(request);

    if (!authResult.ok) {
      return errorResponse(authResult.error, authResult.status, {
        origin: request.headers.get("origin"),
      });
    }

    const { id } = await context.params;
    const payload = schema.parse(await request.json());
    const supabase = createAdminClient();

    const { data: existingEnquiry } = await supabase
      .from("enquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (!existingEnquiry) {
      return errorResponse("Enquiry not found", 404, {
        origin: request.headers.get("origin"),
      });
    }

    const { data: enquiry, error } = await supabase
      .from("enquiries")
      .update({
        ...(payload.status ? { status: payload.status } : {}),
        ...(payload.assigned_to !== undefined
          ? { assigned_to: payload.assigned_to }
          : {}),
        ...(payload.notes !== undefined
          ? { notes: sanitizeOptionalText(payload.notes, 5000) }
          : {}),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !enquiry) {
      return errorResponse("Failed to update enquiry", 400, {
        origin: request.headers.get("origin"),
      });
    }

    await writeAuditLog(request, {
      userId: authResult.user.id,
      action: "update",
      resourceType: "enquiry",
      resourceId: id,
      oldData: existingEnquiry,
      newData: enquiry,
    });

    return jsonResponse(
      { enquiry },
      {
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to update enquiry");
  }
}
