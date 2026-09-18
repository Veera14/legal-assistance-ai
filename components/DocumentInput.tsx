"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
} from "lucide-react";
import { SAMPLE_DOCUMENTS } from "@/lib/sample-documents";

interface DocumentInputProps {
  documentText: string;
  onDocumentChange: (text: string) => void;
  userRole: string;
  onUserRoleChange: (role: string) => void;
  documentTitle: string;
  onDocumentTitleChange: (title: string) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  activeActionLabel: string;
}

const COMMON_ROLES = [
  "Tenant",
  "Independent Contractor",
  "Consumer / End User",
  "Employee",
  "Client / Buyer",
  "Small Business Owner",
  "General Signer",
];

export const DocumentInput: React.FC<DocumentInputProps> = ({
  documentText,
  onDocumentChange,
  userRole,
  onUserRoleChange,
  documentTitle,
  onDocumentTitleChange,
  onRunAnalysis,
  isAnalyzing,
  activeActionLabel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const wordCount = documentText.trim() ? documentText.trim().split(/\s+/).length : 0;
  const charCount = documentText.length;
  const estimatedReadMins = Math.ceil(wordCount / 180);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onDocumentChange(content);
        onDocumentTitleChange(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onDocumentChange(content);
        onDocumentTitleChange(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="document-input-container"
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4"
    >
      {/* Top bar: Document Title & Role Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex-1">
          <label htmlFor="doc-title-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Document Name / Label
          </label>
          <input
            id="doc-title-input"
            type="text"
            value={documentTitle}
            onChange={(e) => onDocumentTitleChange(e.target.value)}
            placeholder="e.g., Residential Apartment Lease, Freelance NDA..."
            className="w-full text-sm font-medium text-slate-900 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
        </div>

        {/* User Role / Perspective */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Your Role / Perspective
          </label>
          <div className="flex items-center">
            <input
              id="user-role-input"
              type="text"
              value={userRole}
              onChange={(e) => onUserRoleChange(e.target.value)}
              placeholder="e.g. Tenant, Contractor"
              className="text-sm font-medium text-slate-900 border border-slate-300 rounded-l-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent w-44"
            />
            <button
              id="user-role-dropdown-btn"
              type="button"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="bg-slate-100 hover:bg-slate-200 border border-l-0 border-slate-300 rounded-r-lg px-2 py-2 text-slate-600 transition-colors"
              title="Select common perspective"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {showRoleDropdown && (
            <div
              id="role-dropdown-menu"
              className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-20 text-xs"
            >
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Common Perspectives
              </div>
              {COMMON_ROLES.map((role) => (
                <button
                  key={role}
                  id={`role-option-${role.toLowerCase().replace(/\s+/g, "-")}`}
                  type="button"
                  onClick={() => {
                    onUserRoleChange(role);
                    setShowRoleDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Textarea with Drag and Drop */}
      <div
        id="document-drag-drop-zone"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 rounded-xl transition-all ${
          isDragOver
            ? "border-amber-500 bg-amber-50/30"
            : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
        }`}
      >
        <textarea
          id="legal-document-textarea"
          value={documentText}
          onChange={(e) => onDocumentChange(e.target.value)}
          placeholder="Paste full agreement text, contract clauses, terms of service, or drop a text file here..."
          rows={10}
          className="w-full p-3.5 text-xs sm:text-sm font-mono text-slate-800 bg-transparent border-none resize-y focus:outline-none focus:ring-0 leading-relaxed"
        />

        {/* Floating helper if empty */}
        {!documentText && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              Drag and drop your contract text file (.txt, .md) here, or paste text
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports Leases, NDAs, Contractor Agreements, Terms of Service, and Policy disclosures
            </p>
          </div>
        )}
      </div>

      {/* Bottom control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span id="stat-word-count" className="font-mono">
            <strong>{wordCount.toLocaleString()}</strong> words
          </span>
          <span className="text-slate-300">•</span>
          <span id="stat-char-count" className="font-mono">
            {charCount.toLocaleString()} chars
          </span>
          {wordCount > 0 && (
            <>
              <span className="text-slate-300">•</span>
              <span id="stat-read-time" className="text-slate-500">
                ~{estimatedReadMins} min read
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* File Upload Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.text"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload-input"
          />
          <button
            id="btn-upload-file"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload File</span>
          </button>

          {/* Quick Sample Selector */}
          <div className="relative group">
            <button
              id="btn-quick-sample"
              type="button"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Load Template</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute right-0 bottom-full mb-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-20">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Realistic Template
              </div>
              {SAMPLE_DOCUMENTS.map((doc) => (
                <button
                  key={doc.id}
                  id={`quick-sample-${doc.id}`}
                  type="button"
                  onClick={() => {
                    onDocumentChange(doc.text);
                    onDocumentTitleChange(doc.title);
                    onUserRoleChange(doc.defaultRole);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors flex flex-col"
                >
                  <span className="font-semibold text-slate-900">{doc.title}</span>
                  <span className="text-[11px] text-slate-500 truncate">{doc.description}</span>
                </button>
              ))}
            </div>
          </div>

          {documentText && (
            <button
              id="btn-clear-doc"
              type="button"
              onClick={() => {
                onDocumentChange("");
                onDocumentTitleChange("");
              }}
              className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
              title="Clear document text"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {/* Primary Action Button */}
          <button
            id="btn-execute-analysis"
            type="button"
            disabled={!documentText.trim() || isAnalyzing}
            onClick={onRunAnalysis}
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all ${
              !documentText.trim() || isAnalyzing
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow"
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Legal Text...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeActionLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
