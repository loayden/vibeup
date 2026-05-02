import { randomUUID } from "crypto";

import { NextRequest } from "next/server";

import { errorResponse, handleRouteError, jsonResponse } from "@/lib/api";
import { tryCreateAdminClient } from "@/lib/supabase-server";
import { normalizeSlug, sanitizeText } from "@/lib/utils";

const RESUME_BUCKET = "career-resumes";
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const allowedExtensions = new Set(["pdf", "doc", "docx"]);

function getFileExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  return allowedExtensions.has(extension) ? extension : null;
}

function getMimeTypeFromExtension(extension: string) {
  if (extension === "pdf") {
    return "application/pdf";
  }

  if (extension === "doc") {
    return "application/msword";
  }

  return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
}

export async function POST(request: NextRequest) {
  try {
    const supabase = tryCreateAdminClient();

    if (!supabase) {
      return errorResponse(
        "Resume upload is unavailable right now. Use the resume link option or submit without it and send the file later.",
        503,
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    const formData = await request.formData();
    const fileEntry = formData.get("resume");

    if (!(fileEntry instanceof File)) {
      return errorResponse("Attach a resume file before uploading.", 400, {
        origin: request.headers.get("origin"),
      });
    }

    if (!fileEntry.size || fileEntry.size > MAX_FILE_SIZE_BYTES) {
      return errorResponse("Resume files must be smaller than 8MB.", 413, {
        origin: request.headers.get("origin"),
      });
    }

    const extension = getFileExtension(fileEntry.name);
    const mimeType = fileEntry.type || (extension ? getMimeTypeFromExtension(extension) : "");

    if (!extension || !allowedMimeTypes.has(mimeType)) {
      return errorResponse("Resume files must be PDF, DOC, or DOCX.", 415, {
        origin: request.headers.get("origin"),
      });
    }

    const applicantName = sanitizeText(
      typeof formData.get("name") === "string" ? String(formData.get("name")) : "candidate",
      80,
    );
    const roleName = sanitizeText(
      typeof formData.get("role") === "string" ? String(formData.get("role")) : "general",
      80,
    );

    const applicantSlug = normalizeSlug(applicantName) || "candidate";
    const roleSlug = normalizeSlug(roleName) || "general";
    const today = new Date().toISOString().slice(0, 10);
    const objectPath = `${today}/${roleSlug}/${applicantSlug}-${randomUUID()}.${extension}`;

    let signedUrl: string | null = null;

    try {
      const { data: buckets, error: listBucketsError } = await supabase.storage.listBuckets();

      if (listBucketsError) {
        throw listBucketsError;
      }

      if (!buckets?.some((bucket) => bucket.name === RESUME_BUCKET)) {
        const { error: createBucketError } = await supabase.storage.createBucket(RESUME_BUCKET, {
          public: false,
          allowedMimeTypes: [...allowedMimeTypes],
          fileSizeLimit: `${MAX_FILE_SIZE_BYTES}`,
        });

        if (createBucketError) {
          throw createBucketError;
        }
      }

      const { error: uploadError } = await supabase.storage
        .from(RESUME_BUCKET)
        .upload(objectPath, fileEntry, {
          cacheControl: "3600",
          upsert: false,
          contentType: mimeType,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(RESUME_BUCKET)
        .createSignedUrl(objectPath, ONE_YEAR_IN_SECONDS);

      if (signedUrlError || !signedUrlData?.signedUrl) {
        throw signedUrlError || new Error("Resume uploaded but signed URL creation failed.");
      }

      signedUrl = signedUrlData.signedUrl;
    } catch {
      return errorResponse(
        "Resume upload is unavailable right now. Use the resume link option or submit without it and send the file later.",
        503,
        {
          origin: request.headers.get("origin"),
        },
      );
    }

    return jsonResponse(
      {
        url: signedUrl,
        path: objectPath,
        bucket: RESUME_BUCKET,
      },
      {
        status: 201,
        origin: request.headers.get("origin"),
      },
    );
  } catch (error) {
    return handleRouteError(request, error, "Unable to upload resume");
  }
}
