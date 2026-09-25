"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Printer,
  Download,
  Copy,
  Check,
  Calendar,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  CheckSquare,
  Square,
  FileText,
} from "lucide-react";

export interface IntakeSummary {
  documentType: string;
  primaryParties: string;
  coreTermOrDuration: string;
  financialSummary: string;
}

export interface AttorneyQuestion {
  priority: "High" | "Medium";
  question: string;
  contextWhy: string;
  clauseReference: string;
}

export interface ChecklistStep {
  step: string;
  category: string;
  urgency: string;
}

export interface DeadlineWindow {
  trigger: string;
  timeframe: string;
  consequenceIfMissed: string;
}

export interface CounterProposal {
  currentClause: string;
  counterOffer: string;
  rationale: string;
}

export interface PrepPacketData {
  intakeSummary: IntakeSummary;
  executiveBriefForLawyer: string;
  topQuestionsToAskAttorney: AttorneyQuestion[];
  preSigningChecklist: ChecklistStep[];
  criticalDeadlinesAndWindows: DeadlineWindow[];
  suggestedNegotiationCounterproposals: CounterProposal[];
}

interface PrepPacketViewProps {
  data: PrepPacketData | null;
  isLoading: boolean;
  onGenerate: () => void;
  hasDocument: boolean;
  userConcerns: string;
  onUserConcernsChange: (val: string) => void;
}

export const PrepPacketView: React.FC<PrepPacketViewProps> = React.memo(({
  data,
  isLoading,
  onGenerate,
  hasDocument,
  userConcerns,
  onUserConcernsChange,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (!data) return;

    const md = `# ATTORNEY CONSULTATION BRIEF & PRE-SIGNING PACKET

## INTAKE SUMMARY
- Document Type: ${data.intakeSummary?.documentType}
- Parties: ${data.intakeSummary?.primaryParties}
- Term: ${data.intakeSummary?.coreTermOrDuration}
- Financials: ${data.intakeSummary?.financialSummary}

## EXECUTIVE BRIEF FOR COUNSEL
${data.executiveBriefForLawyer}

## HIGH-PRIORITY QUESTIONS FOR ATTORNEY
${data.topQuestionsToAskAttorney
  ?.map(
    (q, i) =>
      `${i + 1}. [${q.priority}] ${q.question}\n   Context: ${q.contextWhy} (Clause: ${q.clauseReference})`
  )
  .join("\n\n")}

## PRE-SIGNING DUE DILIGENCE CHECKLIST
${data.preSigningChecklist?.map((s, i) => `- [ ] [${s.category}] ${s.step} (${s.urgency})`).join("\n")}

## CRITICAL NOTICE DEADLINES & WINDOWS
${data.criticalDeadlinesAndWindows
  ?.map((d) => `- ${d.trigger}: ${d.timeframe} -> Risk: ${d.consequenceIfMissed}`)
  .join("\n")}

## SUGGESTED COUNTERPROPOSALS
${data.suggestedNegotiationCounterproposals
  ?.map((p) => `- Current: ${p.currentClause}\n  Counter: ${p.counterOffer}\n  Rationale: ${p.rationale}`)
  .join("\n\n")}`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!data) return;
    const element = document.createElement("a");
    const content = `ATTORNEY CONSULTATION BRIEF & DUE DILIGENCE PACKET
===================================================

INTAKE SUMMARY:
Type: ${data.intakeSummary?.documentType}
Parties: ${data.intakeSummary?.primaryParties}
Term: ${data.intakeSummary?.coreTermOrDuration}
Financials: ${data.intakeSummary?.financialSummary}

EXECUTIVE BRIEF FOR LAWYER:
${data.executiveBriefForLawyer}

QUESTIONS TO ASK YOUR ATTORNEY:
${data.topQuestionsToAskAttorney?.map((q, i) => `${i + 1}. ${q.question} [Priority: ${q.priority}]\nWhy: ${q.contextWhy}`).join("\n\n")}

PRE-SIGNING CHECKLIST:
${data.preSigningChecklist?.map((s, i) => `[ ] ${s.step} (${s.urgency})`).join("\n")}

DEADLINES:
${data.criticalDeadlinesAndWindows?.map((d) => `• ${d.trigger} | Window: ${d.timeframe} | Consequence: ${d.consequenceIfMissed}`).join("\n")}`;

    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `attorney-consultation-packet.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="prep-packet-view" className="space-y-6">
      {/* Configuration Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                Lawyer Consultation Prep & Checklist Engine
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Transform this contract into a structured consultation brief, a prioritized question sheet for your lawyer, and a pre-signing due diligence checklist.
            </p>
          </div>

          <button
            id="btn-generate-packet"
            type="button"
            disabled={!hasDocument || isLoading}
            onClick={onGenerate}
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all ${
              !hasDocument || isLoading
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Assembling Prep Packet...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Generate Attorney Prep Packet</span>
              </>
            )}
          </button>
        </div>

        {/* User specific concerns / instructions */}
        <div>
          <label htmlFor="user-concerns-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Specific Worries or Goals You Want Addressed (Optional)
          </label>
          <input
            id="user-concerns-input"
            type="text"
            value={userConcerns}
            onChange={(e) => onUserConcernsChange(e.target.value)}
            placeholder="e.g. 'I want to ensure I can break the lease without forfeiting the full deposit', 'I want to retain my copyright'"
            className="w-full text-xs sm:text-sm text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {isLoading && (
        <div id="prep-loading" className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <div className="w-9 h-9 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-600">
            Synthesizing executive brief for counsel, prioritizing legal questions, and organizing timeline windows...
          </p>
        </div>
      )}

      {data && !isLoading && (
        <div id="prep-packet-content" className="space-y-6">
          {/* Action Bar (Export, Print, Copy) */}
          <div className="flex items-center justify-between bg-white p-3.5 border border-slate-200 rounded-xl print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Attorney Consultation Packet Ready
              </span>
              <span className="text-[11px] text-slate-500">
                (Printable & Exportable)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-print-packet"
                type="button"
                onClick={handlePrint}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Packet</span>
              </button>

              <button
                id="btn-copy-packet-md"
                type="button"
                onClick={handleCopyMarkdown}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? "Copied" : "Copy Markdown"}</span>
              </button>

              <button
                id="btn-download-packet"
                type="button"
                onClick={handleDownloadFile}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          {/* Intake Overview Sheet */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>Legal Intake & Matter Summary</span>
              </h4>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                Matter Brief
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Agreement Type
                </span>
                <span className="font-semibold text-slate-900">{data.intakeSummary?.documentType}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Parties Involved
                </span>
                <span className="font-semibold text-slate-900">{data.intakeSummary?.primaryParties}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Term / Duration
                </span>
                <span className="font-semibold text-slate-900">{data.intakeSummary?.coreTermOrDuration}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Financial Terms
                </span>
                <span className="font-semibold text-slate-900">{data.intakeSummary?.financialSummary}</span>
              </div>
            </div>

            {/* Executive Brief for Lawyer */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                60-Second Counsel Synopsis (For Attorney Consultation)
              </span>
              <div className="p-3.5 bg-slate-50/80 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
                {data.executiveBriefForLawyer}
              </div>
            </div>
          </div>

          {/* High-Priority Questions for Attorney */}
          {data.topQuestionsToAskAttorney && data.topQuestionsToAskAttorney.length > 0 && (
            <div id="attorney-questions-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-700" />
                  <span>Targeted Questions to Ask Your Attorney</span>
                </h4>
                <span className="text-xs text-slate-500">
                  Save time & billable hours by asking focused questions
                </span>
              </div>

              <div className="space-y-3">
                {data.topQuestionsToAskAttorney.map((q, idx) => (
                  <div
                    key={idx}
                    id={`attorney-question-${idx}`}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                          {q.question}
                        </h5>
                      </div>

                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border shrink-0 ${
                          q.priority === "High"
                            ? "bg-rose-100 text-rose-800 border-rose-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {q.priority} Priority
                      </span>
                    </div>

                    <p className="text-slate-600 pl-7">
                      <strong>Why this matters:</strong> {q.contextWhy}
                    </p>

                    {q.clauseReference && (
                      <div className="text-[11px] text-slate-400 pl-7 font-mono">
                        Ref Clause: {q.clauseReference}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pre-Signing Due Diligence Checklist */}
          {data.preSigningChecklist && data.preSigningChecklist.length > 0 && (
            <div id="presigning-checklist-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
                    Pre-Signing Due Diligence Checklist
                  </h4>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {Object.values(completedSteps).filter(Boolean).length} / {data.preSigningChecklist.length} completed
                </span>
              </div>

              <div className="space-y-2">
                {data.preSigningChecklist.map((item, idx) => {
                  const isDone = !!completedSteps[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleStep(idx)}
                      id={`checklist-step-${idx}`}
                      className={`w-full p-3 rounded-lg border text-left flex items-start gap-3 transition-colors ${
                        isDone
                          ? "bg-emerald-50/50 border-emerald-200 text-slate-500 line-through"
                          : "bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0 text-slate-600">
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 text-xs">
                        <span className="font-medium leading-relaxed">{item.step}</span>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 not-italic">
                          <span className="px-1.5 py-0.2 bg-white rounded border border-slate-200 uppercase font-semibold">
                            {item.category}
                          </span>
                          <span>•</span>
                          <span>{item.urgency}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Critical Deadlines and Notice Windows */}
          {data.criticalDeadlinesAndWindows && data.criticalDeadlinesAndWindows.length > 0 && (
            <div id="deadlines-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-700" />
                <span>Notice Deadlines & Forfeiture Timelines</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {data.criticalDeadlinesAndWindows.map((item, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/40 border border-amber-200 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950">{item.trigger}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-semibold">
                        {item.timeframe}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-snug">
                      <strong>Consequence if missed:</strong> {item.consequenceIfMissed}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Negotiation Counterproposals */}
          {data.suggestedNegotiationCounterproposals && (
            <div id="counterproposals-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Ready-to-Send Counterproposals & Language</span>
              </h4>

              <div className="space-y-3">
                {data.suggestedNegotiationCounterproposals.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                    <div className="font-semibold text-slate-700">
                      Current Provision: &ldquo;{item.currentClause}&rdquo;
                    </div>
                    <div className="p-2.5 bg-white rounded border border-emerald-200 text-emerald-950 font-mono text-[11px] leading-relaxed">
                      <strong>Proposed Compromise:</strong> {item.counterOffer}
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      <strong>Rationale:</strong> {item.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!data && !isLoading && (
        <div id="prep-empty" className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-2">
          <ClipboardList className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Prep Packet Not Yet Generated
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click &ldquo;Generate Attorney Prep Packet&rdquo; above to assemble an executive brief for a lawyer, pre-signing checklist, and key notice windows.
          </p>
        </div>
      )}
    </div>
  );
});

PrepPacketView.displayName = "PrepPacketView";

