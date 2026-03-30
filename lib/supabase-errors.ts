export function getSupabaseErrorCode(error: unknown) {
  if (
    typeof error === "object" &&
    error &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return null;
}

export function getSupabaseErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return null;
}

export function isSupabaseConnectionError(error: unknown) {
  const message = getSupabaseErrorMessage(error);

  if (!message) {
    return false;
  }

  const normalized = message.toLowerCase();
  return (
    normalized.includes("fetch failed") ||
    normalized.includes("enotfound") ||
    normalized.includes("getaddrinfo") ||
    normalized.includes("network") ||
    normalized.includes("supabase")
  );
}

export function isMissingSupabaseTableError(error: unknown) {
  const code = getSupabaseErrorCode(error);
  const message = getSupabaseErrorMessage(error)?.toLowerCase() || "";

  return (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("could not find the table") ||
    (message.includes("relation") && message.includes("does not exist"))
  );
}

export function isSupabaseMissingColumnError(error: unknown) {
  const code = getSupabaseErrorCode(error);
  const message = getSupabaseErrorMessage(error)?.toLowerCase() || "";

  return (
    code === "42703" ||
    (message.includes("column") && message.includes("does not exist"))
  );
}

export function isBackupEligibleSupabaseError(error: unknown) {
  return isSupabaseConnectionError(error) || isMissingSupabaseTableError(error);
}
