"use client";

import React from "react";
import {
  FileText,
  GitCompare,
  AlertOctagon,
  HelpCircle,
  ClipboardList,
  FolderOpen,
  Sparkles,
} from "lucide-react";

export type ActiveTab = "simplify" | "compare" | "risks" | "qa" | "preppacket";

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasDocument: boolean;
  onOpenSamples: () => void;
  savedCount: number;
  onOpenHistory: () => void;
  onOpenAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  hasDocument,
  onOpenSamples,
  savedCount,
  onOpenHistory,
  onOpenAssistant,
}) => {
  const tabs = [
    {
      id: "simplify" as ActiveTab,
      label: "1. Simplify & Translate",
      icon: FileText,
      tooltip: "Plain-English translations, party obligations & jargon glossary",
    },
    {
      id: "compare" as ActiveTab,
      label: "2. Compare Contracts",
      icon: GitCompare,
      tooltip: "Side-by-side contract comparison & divergence matrix",
    },
    {
      id: "risks" as ActiveTab,
      label: "3. Risk & Trap Audit",
      icon: AlertOctagon,
      tooltip: "Scoring, hidden fees, arbitration, & aggressive clauses",
    },
    {
      id: "qa" as ActiveTab,
      label: "4. Grounded Q&A",
      icon: HelpCircle,
      tooltip: "Ask questions with exact contract citations",
    },
    {
      id: "preppacket" as ActiveTab,
      label: "5. Lawyer Prep & Checklist",
      icon: ClipboardList,
      tooltip: "Actionable consultation packet & due diligence checklist",
    },
  ];

  return (
    <header id="main-header" className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              §
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">
                  LegalAssist
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  GenAI Legal Navigator
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Demystify contracts, compare clauses & prepare for legal counsel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="header-btn-assistant"
              onClick={onOpenAssistant}
              type="button"
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Smart Co-Pilot</span>
            </button>

            <button
              id="header-btn-samples"
              onClick={onOpenSamples}
              type="button"
              className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Sample Contracts</span>
            </button>

            <button
              id="header-btn-history"
              onClick={onOpenHistory}
              type="button"
              className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 relative"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Saved</span>
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-slate-900 text-white text-[10px] font-bold rounded-full">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav
          id="tab-navigation"
          aria-label="Workflow Navigation"
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                type="button"
                title={tab.tooltip}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.id !== "compare" && hasDocument && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-amber-400" : "bg-emerald-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
