"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Send,
  Sparkles,
  Quote,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export interface Citation {
  clauseTitle: string;
  exactQuote: string;
  interpretation: string;
}

export interface ScenarioOption {
  scenario: string;
  whatContractSays: string;
  recommendedAction: string;
}

export interface QAResult {
  question: string;
  directAnswer: string;
  confidence: string;
  citations: Citation[];
  potentialScenariosAndOptions: ScenarioOption[];
  silentOrUnclearAreas: string;
  recommendedQuestionsForAttorney: string[];
}

interface QAViewProps {
  onAskQuestion: (question: string) => Promise<void>;
  isAnswering: boolean;
  history: QAResult[];
  hasDocument: boolean;
}

const COMMON_QUESTIONS = [
  "What happens if I need to terminate this agreement early?",
  "Can the other party modify these terms without my written consent?",
  "What are the notice rules for entry, inspections, or access?",
  "What liabilities or damages am I exposed to if something goes wrong?",
  "How are disputes resolved (court trial vs mandatory binding arbitration)?",
  "Are there automatic renewals or fee escalation clauses?",
];

export const QAView: React.FC<QAViewProps> = ({
  onAskQuestion,
  isAnswering,
  history,
  hasDocument,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim() || isAnswering) return;
    onAskQuestion(currentQuestion);
    setCurrentQuestion("");
  };

  const handleChipClick = (q: string) => {
    if (isAnswering) return;
    onAskQuestion(q);
  };

  return (
    <div id="qa-view" className="space-y-6">
      {/* Question Input Box & Suggested Chips */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Grounded Legal Q&A Navigator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask any question about your rights, clauses, and options. Answers are strictly verified against your provided document with exact citations.
          </p>
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Frequently Asked Inquiries
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                id={`qa-chip-${idx}`}
                type="button"
                onClick={() => handleChipClick(q)}
                disabled={isAnswering || !hasDocument}
                className="text-[11px] font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-3 py-1 text-left transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            id="qa-input-field"
            type="text"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            disabled={!hasDocument || isAnswering}
            placeholder={
              hasDocument
                ? "Ask a question (e.g. 'Can my deposit be withheld for repainting?', 'What is the cure window?')"
                : "Please provide a document above first to ask questions..."
            }
            className="flex-1 text-xs sm:text-sm text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all disabled:bg-slate-100"
          />

          <button
            id="btn-submit-qa"
            type="submit"
            disabled={!currentQuestion.trim() || !hasDocument || isAnswering}
            className={`px-4 py-2.5 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all ${
              !currentQuestion.trim() || !hasDocument || isAnswering
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow"
            }`}
          >
            {isAnswering ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Ask Question</span>
          </button>
        </form>
      </div>

      {/* Loading state for new answer */}
      {isAnswering && (
        <div id="qa-loading" className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-600">
            Searching document clauses, validating exact citations, and evaluating legal options...
          </p>
        </div>
      )}

      {/* Q&A Thread / History */}
      {history.length > 0 ? (
        <div id="qa-history-thread" className="space-y-6">
          {history.map((item, idx) => (
            <div
              key={idx}
              id={`qa-item-${idx}`}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    Q
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {item.question}
                  </h4>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                  Confidence: {item.confidence}
                </span>
              </div>

              {/* Direct Answer */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Plain-English Answer
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                  {item.directAnswer}
                </p>
              </div>

              {/* Citations */}
              {item.citations && item.citations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Contract Citations & Textual Proof</span>
                  </span>

                  <div className="space-y-2">
                    {item.citations.map((cite, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5"
                      >
                        <div className="font-bold text-slate-900 flex items-center justify-between">
                          <span>{cite.clauseTitle}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Excerpt</span>
                        </div>
                        <p className="font-mono text-[11px] text-slate-700 italic bg-white p-2 rounded border border-slate-200/70">
                          &ldquo;{cite.exactQuote}&rdquo;
                        </p>
                        <p className="text-slate-600 text-[11px]">
                          <strong>Interpretation:</strong> {cite.interpretation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Potential Scenarios & Options */}
              {item.potentialScenariosAndOptions && item.potentialScenariosAndOptions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Scenarios & Recommended Action Steps
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {item.potentialScenariosAndOptions.map((opt, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs space-y-1"
                      >
                        <div className="font-semibold text-amber-950">{opt.scenario}</div>
                        <p className="text-slate-700 text-[11px]">
                          <strong>Contract Rule:</strong> {opt.whatContractSays}
                        </p>
                        <p className="text-amber-900 text-[11px] font-medium pt-1 border-t border-amber-100">
                          <strong>Action to Take:</strong> {opt.recommendedAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Silent / Unclear Areas */}
              {item.silentOrUnclearAreas && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-0.5">
                  <span className="font-semibold text-slate-800 text-[11px] block">
                    Statutory Defaults & Silence Analysis:
                  </span>
                  <p className="leading-relaxed">{item.silentOrUnclearAreas}</p>
                </div>
              )}

              {/* Questions for Attorney */}
              {item.recommendedQuestionsForAttorney && item.recommendedQuestionsForAttorney.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Follow-Up Inquiries For an Attorney:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {item.recommendedQuestionsForAttorney.map((q, qIdx) => (
                      <li key={qIdx} className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div id="qa-empty" className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            No Questions Asked Yet
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click one of the suggested prompt chips above or type a specific question about your rights, obligations, or deadlines.
          </p>
        </div>
      )}
    </div>
  );
};
