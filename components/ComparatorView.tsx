"use client";

import React, { useState } from "react";
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { SAMPLE_COMPARISON_PAIRS } from "@/lib/sample-documents";

export interface DivergenceItem {
  category: string;
  docAClause: string;
  docBClause: string;
  keyDifference: string;
  moreFavorableToUser: "Doc A" | "Doc B" | "Neutral";
  riskOrOpportunity: string;
}

export interface MissingProvision {
  clauseName: string;
  statusInA: string;
  statusInB: string;
  significance: string;
}

export interface ComparisonData {
  overallComparison: string;
  favorabilityVerdict: {
    favoredDocument: string;
    confidence: string;
    summaryReason: string;
  };
  divergenceMatrix: DivergenceItem[];
  missingProvisions: MissingProvision[];
  strategicNegotiationAdvice: string[];
}

interface ComparatorViewProps {
  onRunCompare: (docA: string, docB: string, labelA: string, labelB: string, role: string) => Promise<void>;
  isComparing: boolean;
  comparisonResult: ComparisonData | null;
}

export const ComparatorView: React.FC<ComparatorViewProps> = ({
  onRunCompare,
  isComparing,
  comparisonResult,
}) => {
  const [docA, setDocA] = useState("");
  const [docB, setDocB] = useState("");
  const [labelA, setLabelA] = useState("Proposal A (Initial Offer)");
  const [labelB, setLabelB] = useState("Proposal B (Counter-Offer / Alternative)");
  const [userRole, setUserRole] = useState("Signer / Contractor");

  const loadSamplePair = (pairId: string) => {
    const pair = SAMPLE_COMPARISON_PAIRS.find((p) => p.id === pairId);
    if (pair) {
      setDocA(pair.docA);
      setDocB(pair.docB);
      setLabelA(pair.docALabel);
      setLabelB(pair.docBLabel);
      setUserRole(pair.userRole);
    }
  };

  const handleCompareClick = () => {
    if (!docA.trim() || !docB.trim()) return;
    onRunCompare(docA, docB, labelA, labelB, userRole);
  };

  return (
    <div id="comparator-view" className="space-y-6">
      {/* Input section: Side-by-side or stacked on mobile */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                Side-by-Side Contract & Policy Comparator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare two proposals, competing contracts, or revised terms to spot changes and determine advantage
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-load-sample-compare"
              type="button"
              onClick={() => loadSamplePair("contractor-comparison")}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Load Sample Comparison</span>
            </button>
          </div>
        </div>

        {/* User Role for comparison */}
        <div className="flex items-center gap-3">
          <label htmlFor="compare-user-role" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Evaluate Advantage For:
          </label>
          <input
            id="compare-user-role"
            type="text"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            placeholder="e.g. Freelancer, Tenant, Consumer..."
            className="text-xs font-medium text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900 w-64"
          />
        </div>

        {/* Dual Document Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document A */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <input
                id="doc-a-label-input"
                type="text"
                value={labelA}
                onChange={(e) => setLabelA(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded px-2 py-1 w-full max-w-xs focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 font-mono">
                {docA.trim() ? docA.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            <textarea
              id="textarea-doc-a"
              value={docA}
              onChange={(e) => setDocA(e.target.value)}
              placeholder="Paste first contract, original lease, or company proposed agreement here..."
              rows={9}
              className="w-full p-3 text-xs font-mono text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Document B */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <input
                id="doc-b-label-input"
                type="text"
                value={labelB}
                onChange={(e) => setLabelB(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded px-2 py-1 w-full max-w-xs focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 font-mono">
                {docB.trim() ? docB.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            <textarea
              id="textarea-doc-b"
              value={docB}
              onChange={(e) => setDocB(e.target.value)}
              placeholder="Paste second contract, counter-proposal, revised version, or alternative here..."
              rows={9}
              className="w-full p-3 text-xs font-mono text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Compare Action Button */}
        <div className="flex justify-end pt-2">
          <button
            id="btn-trigger-comparison"
            type="button"
            disabled={!docA.trim() || !docB.trim() || isComparing}
            onClick={handleCompareClick}
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all ${
              !docA.trim() || !docB.trim() || isComparing
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow"
            }`}
          >
            {isComparing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Comparing Documents...</span>
              </>
            ) : (
              <>
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Run Side-by-Side Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {isComparing && (
        <div id="compare-loading" className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <div className="w-9 h-9 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-600">
            Analyzing divergences across payment, liability, IP rights, termination, and net favorability...
          </p>
        </div>
      )}

      {comparisonResult && !isComparing && (
        <div id="comparison-results" className="space-y-6">
          {/* Favorability Verdict Card */}
          <div
            id="favorability-verdict-card"
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-slate-800" />
                <h4 className="font-semibold text-slate-900 text-sm">
                  Advantage & Favorability Verdict
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Favors:</span>
                <span
                  id="verdict-favored-badge"
                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-amber-400"
                >
                  {comparisonResult.favorabilityVerdict?.favoredDocument}
                </span>
                <span className="text-[10px] text-slate-400">
                  ({comparisonResult.favorabilityVerdict?.confidence} Confidence)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {comparisonResult.favorabilityVerdict?.summaryReason}
            </p>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
              <strong>High-Level Assessment:</strong> {comparisonResult.overallComparison}
            </div>
          </div>

          {/* Divergence Matrix Table */}
          <div id="divergence-matrix-section" className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-slate-700" />
              <span>Clause Divergence Matrix</span>
            </h4>

            <div className="space-y-3">
              {comparisonResult.divergenceMatrix?.map((row, idx) => {
                const isFavA = row.moreFavorableToUser === "Doc A";
                const isFavB = row.moreFavorableToUser === "Doc B";

                return (
                  <div
                    key={idx}
                    id={`divergence-card-${idx}`}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        {row.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          isFavA
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : isFavB
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        Advantage: {row.moreFavorableToUser}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className={`p-2.5 rounded-lg border ${isFavA ? "bg-blue-50/40 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
                        <span className="font-semibold text-slate-700 block mb-1">
                          {labelA}:
                        </span>
                        <p className="text-slate-600 leading-relaxed">{row.docAClause}</p>
                      </div>

                      <div className={`p-2.5 rounded-lg border ${isFavB ? "bg-emerald-50/40 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                        <span className="font-semibold text-slate-700 block mb-1">
                          {labelB}:
                        </span>
                        <p className="text-slate-600 leading-relaxed">{row.docBClause}</p>
                      </div>
                    </div>

                    <div className="text-xs pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-600">
                      <div>
                        <strong>Key Difference:</strong> {row.keyDifference}
                      </div>
                      <div className="text-amber-800 text-[11px] font-medium bg-amber-50 px-2 py-0.5 rounded shrink-0">
                        {row.riskOrOpportunity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missing Provisions */}
          {comparisonResult.missingProvisions && comparisonResult.missingProvisions.length > 0 && (
            <div id="missing-provisions-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Omitted & Missing Protections</span>
              </h4>
              <p className="text-xs text-slate-500">
                Important standard clauses that are omitted or weak in either document
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {comparisonResult.missingProvisions.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{item.clauseName}</span>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">A: {item.statusInA}</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">B: {item.statusInB}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{item.significance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Negotiation Advice */}
          {comparisonResult.strategicNegotiationAdvice && (
            <div id="negotiation-advice-section" className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-semibold text-amber-400 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Strategic Negotiation Counterproposals</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {comparisonResult.strategicNegotiationAdvice.map((advice, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
