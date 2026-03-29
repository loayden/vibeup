import "server-only";

import type { NextRequest } from "next/server";

import { getClientIp, getUserAgent } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase-server";

type AuditLogInput = {
  userId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  oldData?: unknown;
  newData?: unknown;
};

export async function writeAuditLog(
  request: NextRequest,
  input: AuditLogInput,
) {
  try {
    const supabase = createAdminClient();

    await supabase.from("audit_logs").insert({
      user_id: input.userId || null,
      action: input.action,
      resource_type: input.resourceType,
      resource_id: input.resourceId || null,
      old_data: input.oldData || null,
      new_data: input.newData || null,
      ip_address: getClientIp(request),
      user_agent: getUserAgent(request),
    });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }
}
