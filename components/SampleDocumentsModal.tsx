"use client";

import React from "react";
import { X, FileText } from "lucide-react";
import { SAMPLE_DOCUMENTS, SampleDocument } from "@/lib/sample-documents";
import { FocusTrap } from "@/components/FocusTrap";

interface SampleDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (doc: SampleDocument) => void;
}

export const SampleDocumentsModal: React.FC<SampleDocumentsModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="sample-docs-modal-overlay"
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
    >
      <FocusTrap isActive={isOpen} onEscape={onClose} className="w-full max-w-2xl">
        <div
          id="sample-docs-modal-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sample-docs-modal-title"
          aria-describedby="sample-docs-modal-desc"
          className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        >
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 id="sample-docs-modal-title" className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-800" />
                <span>Realistic Legal Agreement Templates</span>
              </h3>
              <p id="sample-docs-modal-desc" className="text-xs text-slate-500 mt-0.5">
                Select a pre-loaded sample agreement to test simplification, risk audits, or lawyer prep immediately.
              </p>
            </div>
            <button
              id="btn-close-sample-modal"
              type="button"
              onClick={onClose}
              aria-label="Close template selector modal"
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-amber-500 outline-hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-5 overflow-y-auto space-y-3 divide-y divide-slate-100">
            {SAMPLE_DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                id={`sample-item-${doc.id}`}
                className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {doc.category}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {doc.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                    {doc.description}
                  </p>
                  <div className="text-[11px] text-slate-400">
                    Default Perspective: <strong className="text-slate-600">{doc.defaultRole}</strong>
                  </div>
                </div>

                <button
                  id={`btn-select-sample-${doc.id}`}
                  type="button"
                  onClick={() => {
                    onSelectSample(doc);
                    onClose();
                  }}
                  aria-label={`Load template ${doc.title}`}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg transition-all shrink-0 self-start sm:self-center focus:ring-2 focus:ring-amber-500 outline-hidden cursor-pointer"
                >
                  Load Template
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 focus:ring-2 focus:ring-amber-500 rounded-lg outline-hidden cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};
