"use client";

import React from "react";
import { Eye, Type, Keyboard } from "lucide-react";

interface AccessibilityBarProps {
  fontSizeLevel: "normal" | "large" | "xlarge";
  onChangeFontSize: (level: "normal" | "large" | "xlarge") => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  fontSizeLevel,
  onChangeFontSize,
  highContrast,
  onToggleHighContrast,
}) => {
  return (
    <div
      id="accessibility-control-bar"
      role="region"
      aria-label="Accessibility & Display Controls"
      className="bg-white border-b border-slate-200 py-1.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2"
    >
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Accessibility & Comfort</span>
        </span>

        {/* Font Size Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => onChangeFontSize("normal")}
            aria-pressed={fontSizeLevel === "normal"}
            aria-label="Normal Font Size"
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              fontSizeLevel === "normal"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => onChangeFontSize("large")}
            aria-pressed={fontSizeLevel === "large"}
            aria-label="Large Font Size"
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              fontSizeLevel === "large"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            A+
          </button>
          <button
            type="button"
            onClick={() => onChangeFontSize("xlarge")}
            aria-pressed={fontSizeLevel === "xlarge"}
            aria-label="Extra Large Font Size"
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              fontSizeLevel === "xlarge"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            A++
          </button>
        </div>

        {/* High Contrast Toggle */}
        <button
          type="button"
          onClick={onToggleHighContrast}
          aria-pressed={highContrast}
          aria-label="Toggle High Contrast Mode"
          className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-medium transition-colors ${
            highContrast
              ? "bg-slate-950 text-amber-300 border-slate-950 font-bold"
              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
          }`}
        >
          {highContrast ? "High Contrast: ON" : "High Contrast: OFF"}
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
        <Keyboard className="w-3.5 h-3.5" />
        <span>Tip: Use Tab / Shift+Tab to navigate with keyboard • Esc closes overlays</span>
      </div>
    </div>
  );
};
