"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
} from "lucide-react";

export interface PartyObligation {
  name: string;
  role: string;
  primaryObligations: string[];
  rights: string[];
}

export interface JargonTerm {
  term: string;
  originalContext: string;
  plainEnglishMeaning: string;
  practicalImpact: string;
}

export interface ClauseItem {
  title: string;
  originalSnippet: string;
  simplifiedExplanation: string;
  importance: "critical" | "important" | "standard";
}

export interface SimplificationData {
  executiveSummary: string;
  readingLevelUsed: string;
  coreParties: PartyObligation[];
  keyTermsExplained: JargonTerm[];
  clauseBreakdown: ClauseItem[];
  immediateActionItems: string[];
}

interface SimplifierViewProps {
  data: SimplificationData | null;
  readingLevel: "standard" | "plain" | "layperson";
  onReadingLevelChange: (lvl: "standard" | "plain" | "layperson") => void;
  isLoading: boolean;
  onReSimplify: () => void;
}

export const SimplifierView: React.FC<SimplifierViewProps> = React.memo(({
  data,
  readingLevel,
  onReadingLevelChange,
  isLoading,
  onReSimplify,
}) => {
  const [jargonQuery, setJargonQuery] = useState("");
  const [expandedClauses, setExpandedClauses] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div id="simplifier-loading" className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">Simplifying Legal Language</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Extracting parties, untangling convoluted syntax, compiling a plain-English jargon dictionary, and mapping core obligations...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div id="simplifier-empty-state" className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">No Document Simplified Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Paste your contract or agreement above, choose your perspective, and click &ldquo;Simplify Document&rdquo; to generate a comprehensive plain-English breakdown.
        </p>
      </div>
    );
  }

  const toggleClause = (idx: number) => {
    setExpandedClauses((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredJargon = (data.keyTermsExplained || []).filter(
    (item) =>
      item.term.toLowerCase().includes(jargonQuery.toLowerCase()) ||
      item.plainEnglishMeaning.toLowerCase().includes(jargonQuery.toLowerCase()) ||
      item.practicalImpact.toLowerCase().includes(jargonQuery.toLowerCase())
  );

  const handleCopySummary = () => {
    const textToCopy = `EXECUTIVE SUMMARY:
${data.executiveSummary}

CORE PARTIES:
${data.coreParties
  ?.map((p) => `${p.name} (${p.role}): Obligations: ${p.primaryObligations?.join("; ")}`)
  .join("\n\n")}

IMMEDIATE ACTION ITEMS:
${data.immediateActionItems?.map((a, i) => `${i + 1}. ${a}`).join("\n")}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="simplifier-results-view" className="space-y-6">
      {/* Reading Level Selector & Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Reading Clarity:
          </span>
          <div id="reading-level-pills" className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            {(
              [
                { id: "layperson", label: "8th-Grade Layperson" },
                { id: "plain", label: "Plain English (High School)" },
                { id: "standard", label: "Standard Legal Nuance" },
              ] as const
            ).map((level) => (
              <button
                key={level.id}
                id={`btn-level-${level.id}`}
                type="button"
                onClick={() => {
                  onReadingLevelChange(level.id);
                  if (level.id !== data.readingLevelUsed) {
                    onReSimplify();
                  }
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  readingLevel === level.id
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-copy-simplification"
            type="button"
            onClick={handleCopySummary}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? "Copied" : "Copy Summary"}</span>
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div id="executive-summary-card" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
          <FileText className="w-4 h-4 text-slate-700" />
          <span>Plain-English Executive Summary</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          {data.executiveSummary}
        </p>

        {/* Immediate Action Items */}
        {data.immediateActionItems && data.immediateActionItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Immediate Practical Steps
            </h4>
            <ul className="space-y-1.5">
              {data.immediateActionItems.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Who Owes What: Core Parties Breakdown */}
      {data.coreParties && data.coreParties.length > 0 && (
        <div id="core-parties-section" className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Party Breakdown: Who Owes What?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.coreParties.map((party, idx) => (
              <div
                key={idx}
                id={`party-card-${idx}`}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{party.name}</h4>
                    <span className="text-[11px] text-slate-500">{party.role}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase tracking-wider rounded">
                    Party {idx + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block mb-1">
                      Strict Obligations (Must Do)
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {party.primaryObligations?.map((obl, oIdx) => (
                        <li key={oIdx} className="flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                          <span>{obl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-50">
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                      Rights & Entitlements
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {party.rights?.map((r, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jargon Buster / Legalese Dictionary */}
      {data.keyTermsExplained && data.keyTermsExplained.length > 0 && (
        <div id="jargon-buster-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                  Legalese Jargon Buster & Plain-English Glossary
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Latin maxims and dense legal phrasing translated into clear real-world impact
              </p>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                id="jargon-search-input"
                type="text"
                value={jargonQuery}
                onChange={(e) => setJargonQuery(e.target.value)}
                placeholder="Search legal terms..."
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredJargon.map((term, idx) => (
              <div
                key={idx}
                id={`jargon-card-${idx}`}
                className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 font-mono tracking-tight">
                    {term.term}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">§ term</span>
                </div>

                <p className="text-xs font-medium text-slate-800 leading-snug">
                  {term.plainEnglishMeaning}
                </p>

                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div className="text-slate-500 italic truncate">&ldquo;{term.originalContext}&rdquo;</div>
                  <div className="text-amber-900 bg-amber-50/80 p-1.5 rounded border border-amber-100 text-[11px]">
                    <strong>Real-world impact:</strong> {term.practicalImpact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clause-by-Clause Simplified Breakdown */}
      {data.clauseBreakdown && data.clauseBreakdown.length > 0 && (
        <div id="clause-breakdown-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <span>Clause-by-Clause Simplification</span>
            </h3>
            <span className="text-xs text-slate-500">
              {data.clauseBreakdown.length} sections analyzed
            </span>
          </div>

          <div className="space-y-2.5">
            {data.clauseBreakdown.map((clause, idx) => {
              const isExpanded = !!expandedClauses[idx];
              const badgeColors =
                clause.importance === "critical"
                  ? "bg-rose-100 text-rose-800 border-rose-200"
                  : clause.importance === "important"
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : "bg-slate-100 text-slate-700 border-slate-200";

              return (
                <div
                  key={idx}
                  id={`clause-card-${idx}`}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleClause(idx)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badgeColors}`}>
                        {clause.importance}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-900">{clause.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-slate-100 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 font-mono text-[11px] text-slate-600">
                        <span className="text-slate-400 block font-sans text-[10px] uppercase tracking-wider mb-1">
                          Original Excerpt:
                        </span>
                        &ldquo;{clause.originalSnippet}&rdquo;
                      </div>

                      <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-slate-800 space-y-1">
                        <span className="text-emerald-800 font-semibold block text-[11px]">
                          Plain English Meaning:
                        </span>
                        <p className="leading-relaxed">{clause.simplifiedExplanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

SimplifierView.displayName = "SimplifierView";


