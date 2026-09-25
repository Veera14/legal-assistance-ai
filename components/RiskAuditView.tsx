"use client";

import React, { useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileCode,
  Flame,
} from "lucide-react";

export interface RedFlagTrap {
  trapName: string;
  detected: boolean;
  severity: "critical" | "high" | "medium" | "low";
  excerpt: string;
  dangerExplanation: string;
}

export interface RiskItem {
  id: string;
  clauseTitle: string;
  severity: "critical" | "high" | "medium" | "low";
  clauseQuote: string;
  issue: string;
  worstCaseScenario?: string;
  recommendedRevision?: string;
}

export interface OneSidedObligation {
  partyWithBurden: string;
  obligation: string;
  fairAlternative: string;
}

export interface RiskAuditData {
  overallRiskScore: number;
  riskRating: "Critical" | "High" | "Moderate" | "Low";
  riskSummary: string;
  redFlagTraps: RedFlagTrap[];
  criticalRisks: RiskItem[];
  mediumRisks: RiskItem[];
  oneSidedObligations: OneSidedObligation[];
  safeguardsPresent: string[];
}

interface RiskAuditViewProps {
  data: RiskAuditData | null;
  isLoading: boolean;
}

export const RiskAuditView: React.FC<RiskAuditViewProps> = React.memo(({ data, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const [expandedRisks, setExpandedRisks] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div id="risk-loading" className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-rose-600 rounded-full animate-spin mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">Conducting Forensic Risk Audit</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Screening for auto-renewal traps, unilateral modifications, one-sided indemnification, hidden fees, and arbitration waivers...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div id="risk-empty" className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">No Risk Audit Performed Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Ensure a document is entered above, then run &ldquo;Audit Contract Risks&rdquo; to detect hazardous clauses, hidden traps, and one-sided burdens.
        </p>
      </div>
    );
  }

  const toggleRiskExpand = (id: string) => {
    setExpandedRisks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return { text: "text-rose-600", bg: "bg-rose-50", bar: "bg-rose-600", border: "border-rose-200" };
    if (score >= 45) return { text: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500", border: "border-amber-200" };
    return { text: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-600", border: "border-emerald-200" };
  };

  const colors = getScoreColor(data.overallRiskScore || 50);

  const detectedTraps = (data.redFlagTraps || []).filter((t) => t.detected);

  const handleCopyReport = () => {
    const report = `LEGAL RISK AUDIT REPORT
Overall Risk Score: ${data.overallRiskScore}/100 (${data.riskRating})
Summary: ${data.riskSummary}

DETECTED RED FLAG TRAPS:
${detectedTraps.map((t) => `- ${t.trapName}: ${t.dangerExplanation} (Quote: "${t.excerpt}")`).join("\n")}

CRITICAL RISKS:
${data.criticalRisks
  ?.map(
    (r) =>
      `• ${r.clauseTitle}: ${r.issue}\n  Worst Case: ${r.worstCaseScenario || "N/A"}\n  Suggested Revision: ${r.recommendedRevision || "N/A"}`
  )
  .join("\n\n")}`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="risk-audit-results" className="space-y-6">
      {/* Risk Score & Summary Hero */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div
              id="risk-score-badge"
              className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border ${colors.bg} ${colors.border}`}
            >
              <span className={`text-2xl font-black font-mono leading-none ${colors.text}`}>
                {data.overallRiskScore}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                / 100
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base tracking-tight">
                  Contract Risk Assessment
                </h3>
                <span
                  id="risk-rating-pill"
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                >
                  {data.riskRating} Risk Exposure
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated against standard consumer protection and fair commercial covenants
              </p>
            </div>
          </div>

          <button
            id="btn-copy-risk-report"
            type="button"
            onClick={handleCopyReport}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? "Report Copied" : "Copy Audit Report"}</span>
          </button>
        </div>

        {/* Score Progress Bar */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span>0 (Equitable / Standard)</span>
            <span>50 (Moderate Caution)</span>
            <span>100 (Extremely Hazardous)</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${colors.bar}`}
              style={{ width: `${Math.min(100, Math.max(5, data.overallRiskScore))}%` }}
            />
          </div>
        </div>

        {/* Risk Summary Text */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {data.riskSummary}
        </p>
      </div>

      {/* Red Flag Traps Detected */}
      {data.redFlagTraps && data.redFlagTraps.length > 0 && (
        <div id="red-flags-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
                Predatory Trap Screening
              </h4>
            </div>
            <span className="text-xs font-semibold text-rose-600">
              {detectedTraps.length} trap{detectedTraps.length !== 1 ? "s" : ""} flagged
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.redFlagTraps.map((trap, idx) => (
              <div
                key={idx}
                id={`trap-item-${idx}`}
                className={`p-3 rounded-lg border text-xs space-y-1.5 transition-colors ${
                  trap.detected
                    ? "bg-rose-50/50 border-rose-200 text-rose-950"
                    : "bg-slate-50/60 border-slate-200 text-slate-400 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    {trap.detected ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span>{trap.trapName}</span>
                  </span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                      trap.detected ? "bg-rose-200/80 text-rose-800" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {trap.detected ? "Found" : "Not Found"}
                  </span>
                </div>

                {trap.detected && (
                  <>
                    <p className="text-[11px] text-rose-900 leading-snug">
                      {trap.dangerExplanation}
                    </p>
                    {trap.excerpt && trap.excerpt !== "N/A" && (
                      <div className="text-[10px] font-mono text-rose-800/80 bg-rose-100/50 p-1.5 rounded truncate">
                        &ldquo;{trap.excerpt}&rdquo;
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Risks with Worst-Case Scenarios and Suggested Redline */}
      {data.criticalRisks && data.criticalRisks.length > 0 && (
        <div id="critical-risks-section" className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>High & Critical Risk Clauses</span>
          </h4>

          <div className="space-y-3">
            {data.criticalRisks.map((risk, idx) => {
              const riskKey = risk.id || `risk-${idx}`;
              const isExpanded = expandedRisks[riskKey] !== false; // default expanded

              return (
                <div
                  key={riskKey}
                  id={`critical-risk-card-${idx}`}
                  className="bg-white border border-rose-200 rounded-xl overflow-hidden shadow-xs"
                >
                  <div className="p-4 bg-rose-50/40 flex items-start justify-between gap-3 border-b border-rose-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white">
                          Critical
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {risk.clauseTitle}
                        </h5>
                      </div>
                      <p className="text-xs text-rose-950 font-medium mt-1">
                        {risk.issue}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleRiskExpand(riskKey)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-4 space-y-3 text-xs">
                      {/* Quote */}
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700">
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Exact Clause Excerpt:
                        </span>
                        &ldquo;{risk.clauseQuote}&rdquo;
                      </div>

                      {/* Worst Case Scenario */}
                      {risk.worstCaseScenario && (
                        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-950 space-y-1">
                          <span className="font-semibold text-[11px] text-amber-900 block uppercase tracking-wider">
                            Worst-Case Scenario (If Enforced):
                          </span>
                          <p className="leading-relaxed">{risk.worstCaseScenario}</p>
                        </div>
                      )}

                      {/* Recommended Revision */}
                      {risk.recommendedRevision && (
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950 space-y-1">
                          <span className="font-semibold text-[11px] text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                            <FileCode className="w-3.5 h-3.5" />
                            <span>Recommended Counter-Language to Propose:</span>
                          </span>
                          <p className="font-mono text-[11px] bg-white p-2 rounded border border-emerald-200 leading-relaxed">
                            {risk.recommendedRevision}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Medium Risks */}
      {data.mediumRisks && data.mediumRisks.length > 0 && (
        <div id="medium-risks-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Moderate Concerns & Inconsistencies</span>
          </h4>

          <div className="space-y-2.5">
            {data.mediumRisks.map((risk, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{risk.clauseTitle}</span>
                  <span className="text-[10px] font-semibold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Moderate
                  </span>
                </div>
                <p className="text-slate-700">{risk.issue}</p>
                {risk.clauseQuote && (
                  <p className="text-[11px] font-mono text-slate-500 italic truncate">
                    &ldquo;{risk.clauseQuote}&rdquo;
                  </p>
                )}
                {risk.recommendedRevision && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    <strong>Suggested adjustment:</strong> {risk.recommendedRevision}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* One-Sided Obligations */}
      {data.oneSidedObligations && data.oneSidedObligations.length > 0 && (
        <div id="one-sided-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
            Asymmetric & One-Sided Obligations
          </h4>

          <div className="space-y-2">
            {data.oneSidedObligations.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{item.partyWithBurden} carries burden:</span>
                </div>
                <p className="text-slate-700">{item.obligation}</p>
                <div className="pt-1 text-[11px] text-emerald-800">
                  <strong>Fair Mutual Counterpart:</strong> {item.fairAlternative}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safeguards Present */}
      {data.safeguardsPresent && data.safeguardsPresent.length > 0 && (
        <div id="safeguards-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Favorable Safeguards Detected in Contract</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {data.safeguardsPresent.map((safe, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{safe}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

RiskAuditView.displayName = "RiskAuditView";

