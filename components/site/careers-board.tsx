"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MapPin, BriefcaseBusiness } from "lucide-react";
import { useRef, useState } from "react";

import { GlassCard, LiquidButton } from "@/components/site/liquid";
import { LiquidSelect } from "@/components/site/liquid-select";
import type { OPEN_POSITIONS } from "@/lib/site-data";

type BannerState = {
  type: "success" | "error";
  message: string;
};

type FormErrors = Partial<Record<"name" | "email" | "resume_url", string>>;

function FieldLabel({
  children,
  optional = false,
}: {
  children: string;
  optional?: boolean;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <p className="eyebrow">{children}</p>
      {optional ? <span className="eyebrow text-white/18">Optional</span> : null}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-[0.72rem] tracking-[0.08em] text-[rgba(255,140,140,0.88)]">{message}</p>;
}

type Position = (typeof OPEN_POSITIONS)[number];

type CareersBoardProps = {
  positions: readonly Position[];
};

export function CareersBoard({ positions }: CareersBoardProps) {
  const [selectedRole, setSelectedRole] = useState<string>(positions[0]?.role || "");
  const [expandedRole, setExpandedRole] = useState<string>(positions[0]?.role || "");
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [loading, setLoading] = useState(false);
  const [resumeMode, setResumeMode] = useState<"later" | "link" | "upload">("upload");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    phone: string;
    role: string;
    portfolio_url: string;
    linkedin_url: string;
    resume_url: string;
    message: string;
  }>({
    name: "",
    email: "",
    phone: "",
    role: positions[0]?.role || "",
    portfolio_url: "",
    linkedin_url: "",
    resume_url: "",
    message: "",
  });

  function focusForm(role: string) {
    setSelectedRole(role);
    setForm((current) => ({ ...current, role }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "name" || key === "email" || key === "resume_url") {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
    setBanner(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      setErrors((current) => ({
        ...current,
        name: "Use the name you want the hiring team to reply to.",
      }));
      setBanner({
        type: "error",
        message: "Add your name so the hiring team knows who is applying.",
      });
      return;
    }

    if (!form.email.includes("@")) {
      setErrors((current) => ({
        ...current,
        email: "Use a real email address so interview or follow-up steps can reach you.",
      }));
      setBanner({
        type: "error",
        message: "Enter a valid email so we can reply with interview or follow-up steps.",
      });
      return;
    }

    if (resumeMode === "upload" && !resumeFile) {
      setErrors((current) => ({
        ...current,
        resume_url: "Attach a resume file or switch to the link/later option.",
      }));
      setBanner({
        type: "error",
        message: "Attach a resume file or choose another resume option before submitting.",
      });
      return;
    }

    if (resumeMode === "link" && form.resume_url && !form.resume_url.startsWith("http")) {
      setErrors((current) => ({
        ...current,
        resume_url: "Resume links should begin with http or https.",
      }));
      setBanner({
        type: "error",
        message: "Resume links should start with http or https.",
      });
      return;
    }

    setLoading(true);
    setBanner(null);
    let uploadedResumeUrl = form.resume_url || null;

    try {
      if (resumeMode === "upload" && resumeFile) {
        setUploadingResume(true);
        const uploadForm = new FormData();
        uploadForm.set("resume", resumeFile);
        uploadForm.set("name", form.name.trim());
        uploadForm.set("role", form.role.trim());

        const uploadResponse = await fetch("/api/uploads/resume", {
          method: "POST",
          body: uploadForm,
        });

        const uploadPayload = (await uploadResponse.json().catch(() => null)) as
          | { url?: string; error?: string }
          | null;

        if (!uploadResponse.ok || !uploadPayload?.url) {
          setErrors((current) => ({
            ...current,
            resume_url: uploadPayload?.error || "Resume upload failed. Use link or later if needed.",
          }));
          setBanner({
            type: "error",
            message:
              uploadPayload?.error ||
              "Resume upload failed. Use the link option or send it later if storage is unavailable.",
          });
          return;
        }

        uploadedResumeUrl = uploadPayload.url;
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: form.phone || null,
          portfolio_url: form.portfolio_url || null,
          linkedin_url: form.linkedin_url || null,
          resume_url: uploadedResumeUrl || null,
          message: form.message || null,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        setBanner({
          type: "error",
          message: payload?.error || "Unable to submit your application.",
        });
        return;
      }

      setBanner({
        type: "success",
        message:
          payload?.message ||
          "Application submitted successfully. The team will review fit and follow up with the next step.",
      });
      setErrors({});
      setResumeFile(null);
      setForm({
        name: "",
        email: "",
        phone: "",
        role: selectedRole,
        portfolio_url: "",
        linkedin_url: "",
        resume_url: "",
        message: "",
      });
    } catch {
      setBanner({
        type: "error",
        message: "Unable to submit your application.",
      });
    } finally {
      setUploadingResume(false);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {positions.map((position) => (
          <div key={position.role}>
            <GlassCard hover className="h-full px-6 py-6">
              <button
                type="button"
                className="block w-full text-left"
                onClick={() =>
                  setExpandedRole((current) =>
                    current === position.role ? "" : position.role,
                  )
                }
              >
                <div className="flex flex-wrap gap-3">
                  <span className="liquid-button-gold px-4 py-2 !text-[9px]">{position.type}</span>
                  <span className="liquid-button-ghost px-4 py-2 !text-[9px]">{position.location}</span>
                </div>
                <h3 className="mt-5 font-serif text-[2rem] font-light tracking-[0.05em] text-white">
                  {position.role}
                </h3>
                <div className="gold-divider-left mt-4 h-px w-20" />
                <div className="mt-5 flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                  <p className="body-copy text-white/65">{position.location}</p>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <BriefcaseBusiness className="h-4 w-4 text-[var(--gold)]" strokeWidth={1.2} />
                  <p className="body-copy text-white/65">{position.type}</p>
                </div>
                <p className="eyebrow mt-5 text-[var(--gold)] md:hidden">
                  {expandedRole === position.role ? "Hide details" : "View details"}
                </p>
              </button>
              <div className={`${expandedRole === position.role ? "block" : "hidden"} md:block`}>
                <p className="body-copy mt-5">{position.summary}</p>
                <button
                  className="liquid-button-gold mt-7 w-full justify-center"
                  onClick={() => focusForm(position.role)}
                  data-cursor="hover"
                >
                  Apply Now
                </button>
              </div>
            </GlassCard>
          </div>
        ))}
      </div>

      <div ref={formRef}>
        <GlassCard gold className="px-6 py-7 md:px-8">
          <p className="eyebrow mb-4">Application Form</p>
          <h3 className="section-title text-[2.3rem]">
            Apply for <em>{selectedRole || "ZOYA"}</em>
          </h3>
          <p className="body-copy mt-5 max-w-2xl">
            We prefer concise, thoughtful applications. Share the role you want, links that
            demonstrate your work, and a note on the kind of event environment you want to help
            build.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              "Mobile-friendly quick apply flow",
              "Links are enough if you are away from a desktop",
              "Most applicants hear back within 5 to 7 business days",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[16px] border border-[rgba(198,169,98,0.18)] bg-[rgba(198,169,98,0.05)] px-4 py-4"
              >
                <p className="body-copy text-[0.78rem] text-white/64">{item}</p>
              </div>
            ))}
          </div>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence>
              {banner ? (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="overflow-hidden rounded-[18px] px-4 py-3"
                  style={{
                    background:
                      banner.type === "success"
                        ? "rgba(52,211,153,0.08)"
                        : "rgba(255,60,60,0.07)",
                    border:
                      banner.type === "success"
                        ? "1px solid rgba(52,211,153,0.18)"
                        : "1px solid rgba(255,80,80,0.18)",
                  }}
                >
                  <p className="body-copy text-[0.8rem] text-white/70">{banner.message}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Full Name</FieldLabel>
                <input
                  className="glass-input"
                  placeholder="Your full name"
                  autoComplete="name"
                  style={{ fontSize: "16px" }}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                />
                <FieldError message={errors.name} />
              </div>
              <div>
                <FieldLabel>Email Address</FieldLabel>
                <input
                  className="glass-input"
                  placeholder="Best address for follow-up"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  style={{ fontSize: "16px" }}
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                />
                <FieldError message={errors.email} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Phone Number</FieldLabel>
                <input
                  className="glass-input"
                  placeholder="Useful for faster coordination"
                  inputMode="tel"
                  autoComplete="tel"
                  style={{ fontSize: "16px" }}
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Role</FieldLabel>
                <LiquidSelect
                  options={positions.map((position) => ({
                    label: position.role,
                    value: position.role,
                  }))}
                  value={form.role}
                  onChange={(value) => {
                    setSelectedRole(value);
                    setForm((current) => ({ ...current, role: value }));
                  }}
                  placeholder="Select a role"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel optional>Portfolio URL</FieldLabel>
                <input
                  className="glass-input"
                  placeholder="Portfolio, reel, or selected work"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  style={{ fontSize: "16px" }}
                  value={form.portfolio_url}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, portfolio_url: event.target.value }))
                  }
                />
              </div>
              <div>
                <FieldLabel optional>LinkedIn URL</FieldLabel>
                <input
                  className="glass-input"
                  placeholder="LinkedIn profile"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  style={{ fontSize: "16px" }}
                  value={form.linkedin_url}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, linkedin_url: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="rounded-[18px] border border-white/8 bg-white/[0.02] px-4 py-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`${resumeMode === "upload" ? "liquid-button-gold" : "liquid-button-ghost"} !min-h-[42px] !px-4`}
                  onClick={() => {
                    setResumeMode("upload");
                    setBanner(null);
                  }}
                >
                  Upload Resume
                </button>
                <button
                  type="button"
                  className={`${resumeMode === "later" ? "liquid-button-gold" : "liquid-button-ghost"} !min-h-[42px] !px-4`}
                  onClick={() => {
                    setResumeMode("later");
                    setResumeFile(null);
                    updateField("resume_url", "");
                  }}
                >
                  Send Resume Later
                </button>
                <button
                  type="button"
                  className={`${resumeMode === "link" ? "liquid-button-gold" : "liquid-button-ghost"} !min-h-[42px] !px-4`}
                  onClick={() => {
                    setResumeMode("link");
                    setResumeFile(null);
                    setBanner(null);
                  }}
                >
                  Add Resume Link Now
                </button>
              </div>
              <p className="body-copy mt-4 text-[0.8rem] text-white/60">
                {resumeMode === "upload"
                  ? "Upload a PDF, DOC, or DOCX file directly from your phone if you have it ready."
                  : resumeMode === "later"
                  ? "On mobile, you can submit quickly now and send your resume when the team replies."
                  : "Paste a Drive, Dropbox, or portfolio link if your resume is already hosted."}
              </p>
            </div>

            {resumeMode === "upload" ? (
              <div>
                <FieldLabel optional>Resume File</FieldLabel>
                <input
                  className="glass-input file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(198,169,98,0.14)] file:px-4 file:py-2 file:text-[0.75rem] file:tracking-[0.18em] file:text-[var(--gold)]"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ fontSize: "16px" }}
                  onChange={(event) => {
                    setResumeFile(event.target.files?.[0] || null);
                    setErrors((current) => ({ ...current, resume_url: undefined }));
                    setBanner(null);
                  }}
                />
                <p className="body-copy mt-3 text-[0.8rem] text-white/56">
                  {resumeFile ? `Attached: ${resumeFile.name}` : "No file selected yet."}
                </p>
                <FieldError message={errors.resume_url} />
              </div>
            ) : null}

            {resumeMode === "link" ? (
              <div>
                <FieldLabel optional>Resume Link</FieldLabel>
                <input
                  className="glass-input"
                  placeholder="Drive, Dropbox, or portfolio resume URL"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  style={{ fontSize: "16px" }}
                  value={form.resume_url}
                  onChange={(event) => updateField("resume_url", event.target.value)}
                />
                <FieldError message={errors.resume_url} />
              </div>
            ) : null}

            <div>
              <FieldLabel optional>Why This Role</FieldLabel>
              <textarea
                className="glass-input min-h-[160px] resize-none"
                placeholder="Tell us why this role fits your background and the kind of event environment you want to help build."
                rows={5}
                style={{ fontSize: "16px" }}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="body-copy max-w-xl text-[0.78rem]">
                Keep it concise. Strong links and a clear note on fit are more useful than a long
                cover letter on mobile.
              </p>
              <LiquidButton gold type="submit" className="w-full md:w-auto" disabled={loading || uploadingResume}>
                <span className="inline-flex items-center gap-2">
                  {uploadingResume ? "Uploading Resume" : loading ? "Submitting" : "Submit Application"}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.2} />
                </span>
              </LiquidButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
