"use client";

import EmailContent from "./EmailContent";
import { Suspense } from "react";

export default function EmailPage() {
  return (
    <div className="
      min-h-screen 
      flex items-center justify-center 
      bg-gradient-to-br 
      from-white 
      via-[#fffaf0] 
      to-[#f8f3e6] 
      py-16 
      px-6
    ">
      <Suspense fallback={<div className="text-amber-200 text-sm">Loading...</div>}>
        <EmailContent />
      </Suspense>
    </div>
  );
}
