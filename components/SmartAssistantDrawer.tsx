"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Scale,
  ListOrdered,
  ChevronRight,
} from "lucide-react";
import { FocusTrap } from "@/components/FocusTrap";

export interface AssistantResponse {
  assistantMessage: string;
  bargainingLeverage?: {
    tier: "High" | "Balanced" | "Low (Adhesion)";
    explanation: string;
  };
  topDealbreakers?: Array<{
    clauseTitle: string;
    whyCritical: string;
    counterOffer: string;
  }>;
  safeToConcede?: Array<{
    clauseTitle: string;
    whyAcceptable: string;
  }>;
  strategicActionPlan?: string[];
  draftCommunication?: {
    recipient: string;
    subject: string;
    bodyText: string;
  };
}

interface SmartAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentText: string;
  userRole: string;
  currentTab: string;
}

const PRESET_QUERIES = [
  "Analyze my negotiation leverage & posture",
  "What are my top 3 non-negotiable dealbreakers?",
  "Draft a polite email requesting clause revisions",
  "Which clauses look scary but are safe to concede?",
];

export const SmartAssistantDrawer: React.FC<SmartAssistantDrawerProps> = ({
  isOpen,
  onClose,
  documentText,
  userRole,
  currentTab,
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleAskAssistant = async (promptText: string) => {
    if (!promptText.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/legal/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText,
          userRole,
          userMessage: promptText,
          currentTab,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResponse(json.data);
      }
    } catch {
      // Graceful error state
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = () => {
    if (!response?.draftCommunication) return;
    const text = `Subject: ${response.draftCommunication.subject}\n\n${response.draftCommunication.bodyText}`;
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      id="assistant-drawer-overlay"
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150"
    >
      <FocusTrap isActive={isOpen} onEscape={onClose} className="w-full max-w-lg h-full">
        <div
          id="assistant-drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-drawer-title"
          className="bg-white w-full h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 id="assistant-drawer-title" className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>Smart Legal Co-Pilot</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded font-mono uppercase font-semibold">
                    Dynamic
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  Contextual decision-making & negotiation strategy for <strong className="text-white">{userRole}</strong>
                </p>
              </div>
            </div>

            <button
              id="btn-close-assistant-drawer"
              type="button"
              onClick={onClose}
              aria-label="Close Smart Legal Co-Pilot panel"
              className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-amber-500 outline-hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Quick Preset Prompts */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Strategic Decision Inquiries
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {PRESET_QUERIES.map((preset, idx) => (
                  <button
                    key={idx}
                    id={`assistant-preset-${idx}`}
                    type="button"
                    onClick={() => {
                      setQuery(preset);
                      handleAskAssistant(preset);
                    }}
                    disabled={loading}
                    className="text-left text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 p-2.5 rounded-lg transition-colors flex items-center justify-between group disabled:opacity-50 focus:ring-2 focus:ring-amber-500 outline-hidden cursor-pointer"
                  >
                    <span>{preset}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div id="assistant-loading" role="status" aria-live="polite" className="p-8 text-center space-y-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-8 h-8 border-3 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  Evaluating document leverage, non-negotiable clauses, and drafting strategic counter-terms...
                </p>
              </div>
            )}

            {/* Assistant Response Display */}
            {response && !loading && (
              <div id="assistant-response-card" className="space-y-4 animate-in fade-in duration-200">
                {/* Leverage Assessment */}
                {response.bargainingLeverage && (
                  <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-amber-700" />
                        <span>Negotiation Leverage Assessment:</span>
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          response.bargainingLeverage.tier.includes("High")
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : response.bargainingLeverage.tier.includes("Balanced")
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-rose-100 text-rose-800 border-rose-200"
                        }`}
                      >
                        {response.bargainingLeverage.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {response.bargainingLeverage.explanation}
                    </p>
                  </div>
                )}

                {/* Conversational Advice */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {response.assistantMessage}
                </div>

                {/* Top Dealbreakers */}
                {response.topDealbreakers && response.topDealbreakers.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Non-Negotiable Dealbreakers</span>
                    </h4>
                    <div className="space-y-2">
                      {response.topDealbreakers.map((item, idx) => (
                        <div key={idx} className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg text-xs space-y-1">
                          <div className="font-bold text-rose-950">{item.clauseTitle}</div>
                          <p className="text-slate-700">{item.whyCritical}</p>
                          <div className="p-2 bg-white rounded border border-rose-200/80 font-mono text-[11px] text-slate-800">
                            <strong>Counter-language:</strong> {item.counterOffer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safe to Concede */}
                {response.safeToConcede && response.safeToConcede.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Safe to Concede (Standard Clauses)</span>
                    </h4>
                    <div className="space-y-1.5">
                      {response.safeToConcede.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-emerald-50/40 border border-emerald-200 rounded-lg text-xs">
                          <div className="font-semibold text-emerald-950">{item.clauseTitle}</div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{item.whyAcceptable}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Plan */}
                {response.strategicActionPlan && response.strategicActionPlan.length > 0 && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-slate-700" />
                      <span>Strategic Next Steps</span>
                    </h4>
                    <ol className="space-y-1 list-decimal list-inside text-slate-700">
                      {response.strategicActionPlan.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Drafted Email to Counterparty */}
                {response.draftCommunication && (
                  <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold flex items-center gap-1.5 text-amber-300">
                        <Mail className="w-4 h-4" />
                        <span>Ready-to-Send Counterproposal Email</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        aria-label="Copy draft email to clipboard"
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] flex items-center gap-1 transition-colors focus:ring-2 focus:ring-amber-500 outline-hidden cursor-pointer"
                      >
                        {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      <div><strong>To:</strong> {response.draftCommunication.recipient}</div>
                      <div><strong>Subject:</strong> {response.draftCommunication.subject}</div>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700/80 text-[11px] leading-relaxed whitespace-pre-wrap font-sans text-slate-200">
                      {response.draftCommunication.bodyText}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Form at Bottom */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAssistant(query);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                id="assistant-input-query"
                aria-label="Ask assistant for strategy or clause analysis"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask for strategy, negotiation advice, or clause analysis..."
                className="flex-1 text-xs text-slate-900 border border-slate-300 rounded-lg px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
              <button
                id="btn-submit-assistant-query"
                type="submit"
                disabled={!query.trim() || loading}
                aria-label="Send query to assistant"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-amber-500 outline-hidden cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};
