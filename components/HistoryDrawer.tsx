"use client";

import React from "react";
import { X, Trash2, FolderOpen, ArrowRight, Clock } from "lucide-react";
import { SimplificationData } from "./SimplifierView";
import { RiskAuditData } from "./RiskAuditView";
import { PrepPacketData } from "./PrepPacketView";
import { QAResult } from "./QAView";
import { FocusTrap } from "@/components/FocusTrap";

export interface SavedAnalysis {
  id: string;
  timestamp: number;
  documentTitle: string;
  documentText: string;
  userRole: string;
  simplificationData?: SimplificationData | null;
  riskAuditData?: RiskAuditData | null;
  prepPacketData?: PrepPacketData | null;
  qaHistory?: QAResult[];
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedAnalysis[];
  onRestore: (item: SavedAnalysis) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedItems,
  onRestore,
  onDelete,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="history-drawer-overlay"
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150"
    >
      <FocusTrap isActive={isOpen} onEscape={onClose} className="w-full max-w-md h-full">
        <div
          id="history-drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-drawer-title"
          className="bg-white w-full h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        >
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-slate-800" />
              <h3 id="history-drawer-title" className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                Saved Analyses & Documents
              </h3>
            </div>

            <button
              id="btn-close-history-drawer"
              type="button"
              onClick={onClose}
              aria-label="Close saved documents panel"
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-amber-500 outline-hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {savedItems.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium text-slate-600">No saved sessions yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Whenever you analyze or simplify a document, it is automatically cached here for easy retrieval.
                </p>
              </div>
            ) : (
              savedItems.map((item) => (
                <div
                  key={item.id}
                  id={`history-item-${item.id}`}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {item.documentTitle || "Untitled Document"}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      aria-label={`Delete saved document ${item.documentTitle}`}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-white transition-colors focus:ring-2 focus:ring-rose-500 outline-hidden cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="px-1.5 py-0.2 bg-white rounded border border-slate-200">
                      Role: {item.userRole}
                    </span>
                    {item.riskAuditData && (
                      <span className="px-1.5 py-0.2 bg-rose-50 text-rose-800 rounded border border-rose-200 font-semibold">
                        Risk: {item.riskAuditData.overallRiskScore}/100
                      </span>
                    )}
                    {item.simplificationData && (
                      <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                        Simplified
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onRestore(item);
                      onClose();
                    }}
                    aria-label={`Restore session for ${item.documentTitle}`}
                    className="w-full mt-2 py-1.5 px-3 bg-white hover:bg-slate-900 hover:text-white text-slate-900 border border-slate-200 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-amber-500 outline-hidden cursor-pointer"
                  >
                    <span>Restore Session</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {savedItems.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                id="btn-clear-all-history"
                type="button"
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium focus:ring-2 focus:ring-rose-500 rounded px-1.5 py-1 outline-hidden cursor-pointer"
              >
                Clear All Saved Sessions
              </button>
              <span className="text-[11px] text-slate-400">
                {savedItems.length} record{savedItems.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </FocusTrap>
    </div>
  );
};
