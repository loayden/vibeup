"use client";

import EmailContent from "./EmailContent";
import { Suspense } from "react";

export default function EmailPage() {
  return (
    <div className="
      min-h-screen 
      flex items-center justify-center 
      bg-gradient-to-br 
      from-black/80 
      via-[#1a0730]/70 
      to-[#2d1b09]/80 
      py-16 
      px-6
    ">
      <Suspense fallback={<div className="text-amber-200 text-sm">Loading...</div>}>
        <EmailContent />
      </Suspense>
    </div>
  );
}