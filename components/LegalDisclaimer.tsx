"use client";

import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface LegalDisclaimerProps {
  compact?: boolean;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div
        id="legal-disclaimer-compact"
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 bg-slate-100 border border-slate-200 rounded-md"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>
          <strong>Informational Literacy Tool:</strong> This tool provides plain-language summaries and analysis to help you understand legal texts. It does not provide legal advice or establish an attorney-client relationship. Always consult a licensed attorney for specific legal counsel.
        </span>
      </div>
    );
  }

  return (
    <div
      id="legal-disclaimer-banner"
      className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl text-amber-950 text-sm shadow-xs"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-900 tracking-tight">
            Important Legal Notice & Ethical Boundary
          </p>
          <p className="text-amber-800 text-xs leading-relaxed">
            This AI-powered assistant is engineered to improve document literacy, illuminate dense legalese, compare terms, and assist in preparing questions for professional counsel. It is <strong>not a licensed legal practitioner</strong>, does not form an attorney-client relationship, and its output should not be relied upon as binding legal advice or a substitute for a qualified lawyer in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};
