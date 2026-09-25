"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Header, ActiveTab } from "@/components/Header";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { DocumentInput } from "@/components/DocumentInput";
import { SimplificationData } from "@/components/SimplifierView";
import { ComparisonData } from "@/components/ComparatorView";
import { RiskAuditData } from "@/components/RiskAuditView";
import { QAResult } from "@/components/QAView";
import { PrepPacketData } from "@/components/PrepPacketView";
import { SavedAnalysis } from "@/components/HistoryDrawer";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAnnounce } from "@/components/AriaLiveAnnouncer";
import { SAMPLE_DOCUMENTS, SampleDocument } from "@/lib/sample-documents";
import { AlertCircle, CheckCircle2, Shield, Sparkles } from "lucide-react";

// Dynamic imports for code splitting & initial JS bundle size minimization
const ViewSkeleton = ({ title }: { title: string }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 animate-pulse">
    <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
    <p className="text-xs font-semibold text-slate-700">{title}</p>
  </div>
);

const SimplifierView = dynamic(
  () => import("@/components/SimplifierView").then((mod) => mod.SimplifierView),
  { loading: () => <ViewSkeleton title="Loading Simplifier Engine..." /> }
);
const ComparatorView = dynamic(
  () => import("@/components/ComparatorView").then((mod) => mod.ComparatorView),
  { loading: () => <ViewSkeleton title="Loading Comparator Engine..." /> }
);
const RiskAuditView = dynamic(
  () => import("@/components/RiskAuditView").then((mod) => mod.RiskAuditView),
  { loading: () => <ViewSkeleton title="Loading Risk Audit Engine..." /> }
);
const QAView = dynamic(
  () => import("@/components/QAView").then((mod) => mod.QAView),
  { loading: () => <ViewSkeleton title="Loading Grounded Q&A..." /> }
);
const PrepPacketView = dynamic(
  () => import("@/components/PrepPacketView").then((mod) => mod.PrepPacketView),
  { loading: () => <ViewSkeleton title="Loading Lawyer Prep Engine..." /> }
);
const SampleDocumentsModal = dynamic(
  () => import("@/components/SampleDocumentsModal").then((mod) => mod.SampleDocumentsModal)
);
const HistoryDrawer = dynamic(
  () => import("@/components/HistoryDrawer").then((mod) => mod.HistoryDrawer)
);
const SmartAssistantDrawer = dynamic(
  () => import("@/components/SmartAssistantDrawer").then((mod) => mod.SmartAssistantDrawer)
);

const STORAGE_KEY = "lexi_legal_saved_sessions_v1";

const emptySessions: SavedAnalysis[] = [];
let cachedRaw: string | null = null;
let cachedParsed: SavedAnalysis[] = emptySessions;

function subscribeSessions(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("lexi-storage-update", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("lexi-storage-update", callback);
  };
}

function getSessionsSnapshot(): SavedAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw && raw !== null) {
      return cachedParsed;
    }
    cachedRaw = raw;
    if (raw) {
      cachedParsed = JSON.parse(raw);
      return cachedParsed;
    }
  } catch {
    // Local storage unavailable
  }
  cachedRaw = null;
  cachedParsed = emptySessions;
  return emptySessions;
}

function getServerSnapshot(): SavedAnalysis[] {
  return emptySessions;
}

export default function HomePage() {
  const { announce } = useAnnounce();
  const [activeTab, setActiveTab] = useState<ActiveTab>("simplify");
  const [documentTitle, setDocumentTitle] = useState(() => SAMPLE_DOCUMENTS[0]?.title || "Residential Lease Agreement");
  const [documentText, setDocumentText] = useState(() => SAMPLE_DOCUMENTS[0]?.text || "");
  const [userRole, setUserRole] = useState(() => SAMPLE_DOCUMENTS[0]?.defaultRole || "Tenant");

  // View States & Data
  const [simplificationData, setSimplificationData] = useState<SimplificationData | null>(null);
  const [readingLevel, setReadingLevel] = useState<"standard" | "plain" | "layperson">("plain");
  const [isSimplifying, setIsSimplifying] = useState(false);

  const [comparisonResult, setComparisonResult] = useState<ComparisonData | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const [riskAuditData, setRiskAuditData] = useState<RiskAuditData | null>(null);
  const [isAuditingRisks, setIsAuditingRisks] = useState(false);

  const [qaHistory, setQaHistory] = useState<QAResult[]>([]);
  const [isAnsweringQA, setIsAnsweringQA] = useState(false);

  const [prepPacketData, setPrepPacketData] = useState<PrepPacketData | null>(null);
  const [userConcerns, setUserConcerns] = useState("");
  const [isPreppingPacket, setIsPreppingPacket] = useState(false);

  // Modals & Drawers
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Accessibility & Display Controls
  const [fontSizeLevel, setFontSizeLevel] = useState<"normal" | "large" | "xlarge">("normal");
  const [highContrast, setHighContrast] = useState(false);

  // Keyboard shortcut listener for accessibility (Esc key closes modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSampleModalOpen(false);
        setIsHistoryDrawerOpen(false);
        setIsAssistantOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const savedSessions = useSyncExternalStore(subscribeSessions, getSessionsSnapshot, getServerSnapshot);

  // Banner Notification
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    announce(message, type === "error" ? "assertive" : "polite");
    setTimeout(() => setNotification(null), 4500);
  }, [announce]);

  const persistCurrentSession = useCallback((
    updatedSimplification?: SimplificationData | null,
    updatedRisk?: RiskAuditData | null,
    updatedPrep?: PrepPacketData | null,
    updatedQa?: QAResult[]
  ) => {
    try {
      const newSession: SavedAnalysis = {
        id: "session-" + Date.now(),
        timestamp: Date.now(),
        documentTitle: documentTitle || "Legal Document",
        documentText,
        userRole,
        simplificationData: updatedSimplification !== undefined ? updatedSimplification : simplificationData,
        riskAuditData: updatedRisk !== undefined ? updatedRisk : riskAuditData,
        prepPacketData: updatedPrep !== undefined ? updatedPrep : prepPacketData,
        qaHistory: updatedQa !== undefined ? updatedQa : qaHistory,
      };

      const updated = [newSession, ...savedSessions.filter((s) => s.documentTitle !== documentTitle)].slice(0, 15);
      cachedRaw = JSON.stringify(updated);
      cachedParsed = updated;
      localStorage.setItem(STORAGE_KEY, cachedRaw);
      window.dispatchEvent(new Event("lexi-storage-update"));
    } catch {
      // Ignore local storage write errors
    }
  }, [documentTitle, documentText, userRole, simplificationData, riskAuditData, prepPacketData, qaHistory, savedSessions]);

  const handleSimplifyDocument = useCallback(async () => {
    if (!documentText.trim()) {
      showNotification("error", "Please enter or paste legal document text first.");
      return;
    }

    setIsSimplifying(true);
    announce("Simplifying contract into plain English...", "polite");

    try {
      const response = await fetch("/api/legal/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText,
          readingLevel,
          partyPerspective: userRole,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Simplification failed.");
      }

      setSimplificationData(json.data);
      persistCurrentSession(json.data, undefined, undefined, undefined);
      showNotification("success", "Contract successfully translated into plain English.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Simplification error occurred.";
      showNotification("error", msg);
    } finally {
      setIsSimplifying(false);
    }
  }, [documentText, readingLevel, userRole, announce, showNotification, persistCurrentSession]);

  const handleAuditRisks = useCallback(async () => {
    if (!documentText.trim()) {
      showNotification("error", "Please enter or paste legal document text first.");
      return;
    }

    setIsAuditingRisks(true);
    announce("Auditing forensic contract risks and predatory traps...", "polite");

    try {
      const response = await fetch("/api/legal/risk-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText,
          userRole,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Risk audit failed.");
      }

      setRiskAuditData(json.data);
      persistCurrentSession(undefined, json.data, undefined, undefined);
      showNotification("success", `Risk audit completed. Overall Risk Score: ${json.data.overallRiskScore}/100.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Risk audit error occurred.";
      showNotification("error", msg);
    } finally {
      setIsAuditingRisks(false);
    }
  }, [documentText, userRole, announce, showNotification, persistCurrentSession]);

  const handleCompareDocuments = useCallback(async (docA: string, docB: string, labelA: string, labelB: string, role?: string) => {
    if (!docA.trim() || !docB.trim()) {
      showNotification("error", "Please provide text for both agreements to run comparison.");
      return;
    }

    setIsComparing(true);
    announce("Comparing agreements side-by-side...", "polite");

    try {
      const response = await fetch("/api/legal/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docAText: docA,
          docBText: docB,
          docALabel: labelA,
          docBLabel: labelB,
          userRole: role || userRole,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Contract comparison failed.");
      }

      setComparisonResult(json.data);
      showNotification("success", "Side-by-side contract comparison completed.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Comparison error occurred.";
      showNotification("error", msg);
    } finally {
      setIsComparing(false);
    }
  }, [userRole, announce, showNotification]);

  const handleAskQuestion = useCallback(async (question: string) => {
    if (!documentText.trim()) {
      showNotification("error", "Please enter or paste document text before asking questions.");
      return;
    }

    if (!question.trim()) return;

    setIsAnsweringQA(true);
    announce("Searching contract for citations and answers...", "polite");

    try {
      const response = await fetch("/api/legal/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText,
          question,
          userRole,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Answering question failed.");
      }

      const newQA: QAResult = {
        question,
        directAnswer: json.data.directAnswer,
        confidence: json.data.confidence,
        citations: json.data.citations || [],
        potentialScenariosAndOptions: json.data.potentialScenariosAndOptions || [],
        silentOrUnclearAreas: json.data.silentOrUnclearAreas || "",
        recommendedQuestionsForAttorney: json.data.recommendedQuestionsForAttorney || [],
      };

      setQaHistory((prev) => {
        const updatedHistory = [newQA, ...prev];
        persistCurrentSession(undefined, undefined, undefined, updatedHistory);
        return updatedHistory;
      });
      showNotification("success", "Answer generated with exact contract textual citations.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Q&A error occurred.";
      showNotification("error", msg);
    } finally {
      setIsAnsweringQA(false);
    }
  }, [documentText, userRole, announce, showNotification, persistCurrentSession]);

  const handleGeneratePrepPacket = useCallback(async () => {
    if (!documentText.trim()) {
      showNotification("error", "Please enter or paste legal document text first.");
      return;
    }

    setIsPreppingPacket(true);
    announce("Generating Attorney Consultation Brief & Due Diligence Checklist...", "polite");

    try {
      const response = await fetch("/api/legal/prep-packet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText,
          userRole,
          userConcerns,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Generating attorney prep packet failed.");
      }

      setPrepPacketData(json.data);
      persistCurrentSession(undefined, undefined, json.data, undefined);
      showNotification("success", "Attorney intake packet & pre-signing due diligence checklist ready.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Prep packet error occurred.";
      showNotification("error", msg);
    } finally {
      setIsPreppingPacket(false);
    }
  }, [documentText, userRole, userConcerns, announce, showNotification, persistCurrentSession]);

  const handleSelectSample = useCallback((sample: SampleDocument) => {
    setDocumentTitle(sample.title);
    setDocumentText(sample.text);
    setUserRole(sample.defaultRole);
    setSimplificationData(null);
    setRiskAuditData(null);
    setPrepPacketData(null);
    setQaHistory([]);
    showNotification("success", `Loaded sample template: "${sample.title}"`);
  }, [showNotification]);

  const handleRestoreSession = useCallback((session: SavedAnalysis) => {
    setDocumentTitle(session.documentTitle);
    setDocumentText(session.documentText);
    setUserRole(session.userRole);
    if (session.simplificationData) setSimplificationData(session.simplificationData);
    if (session.riskAuditData) setRiskAuditData(session.riskAuditData);
    if (session.prepPacketData) setPrepPacketData(session.prepPacketData);
    if (session.qaHistory) setQaHistory(session.qaHistory);
    showNotification("success", `Restored session: "${session.documentTitle}"`);
  }, [showNotification]);

  const handleDeleteSession = useCallback((id: string) => {
    const updated = savedSessions.filter((s) => s.id !== id);
    cachedRaw = JSON.stringify(updated);
    cachedParsed = updated;
    localStorage.setItem(STORAGE_KEY, cachedRaw);
    window.dispatchEvent(new Event("lexi-storage-update"));
    showNotification("success", "Session deleted.");
  }, [savedSessions, showNotification]);

  const handleClearAllSessions = useCallback(() => {
    cachedRaw = JSON.stringify([]);
    cachedParsed = emptySessions;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("lexi-storage-update"));
    showNotification("success", "All saved sessions cleared.");
  }, [showNotification]);

  const getActiveActionLabel = useCallback(() => {
    switch (activeTab) {
      case "simplify":
        return "Translate to Plain English";
      case "risks":
        return "Audit Risks & Traps";
      case "preppacket":
        return "Generate Lawyer Packet";
      default:
        return "Run Analysis";
    }
  }, [activeTab]);

  const handlePrimaryAnalyze = useCallback(() => {
    switch (activeTab) {
      case "simplify":
        handleSimplifyDocument();
        break;
      case "risks":
        handleAuditRisks();
        break;
      case "qa":
        break;
      case "preppacket":
        handleGeneratePrepPacket();
        break;
      case "compare":
        break;
    }
  }, [activeTab, handleSimplifyDocument, handleAuditRisks, handleGeneratePrepPacket]);

  return (
    <div
      className={`min-h-screen ${
        highContrast ? "bg-slate-200 text-slate-950 font-medium" : "bg-slate-100/60 text-slate-900"
      } ${
        fontSizeLevel === "large" ? "text-[15px]" : fontSizeLevel === "xlarge" ? "text-base" : "text-sm"
      } flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 transition-colors duration-150`}
    >
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-amber-300 focus:rounded-lg focus:font-bold focus:shadow-xl focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasDocument={!!documentText.trim()}
        onOpenSamples={() => setIsSampleModalOpen(true)}
        savedCount={savedSessions.length}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Accessibility Controls Bar */}
      <AccessibilityBar
        fontSizeLevel={fontSizeLevel}
        onChangeFontSize={setFontSizeLevel}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div
          id="toast-notification"
          role="status"
          aria-live="polite"
          className={`fixed top-24 right-4 sm:right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold animate-in slide-in-from-top duration-150 ${
            notification.type === "success"
              ? "bg-slate-900 text-white border-slate-700"
              : "bg-rose-600 text-white border-rose-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 outline-hidden">
        <ErrorBoundary>
          <LegalDisclaimer />

          {activeTab !== "compare" && (
            <DocumentInput
              documentText={documentText}
              onDocumentChange={setDocumentText}
              userRole={userRole}
              onUserRoleChange={setUserRole}
              documentTitle={documentTitle}
              onDocumentTitleChange={setDocumentTitle}
              onRunAnalysis={handlePrimaryAnalyze}
              isAnalyzing={isSimplifying || isAuditingRisks || isPreppingPacket}
              activeActionLabel={getActiveActionLabel()}
            />
          )}

          {activeTab === "simplify" && (
            <div id="tabpanel-simplify" role="tabpanel" aria-labelledby="nav-tab-simplify">
              <SimplifierView
                data={simplificationData}
                isLoading={isSimplifying}
                onReSimplify={handleSimplifyDocument}
                readingLevel={readingLevel}
                onReadingLevelChange={setReadingLevel}
              />
            </div>
          )}

          {activeTab === "risks" && (
            <div id="tabpanel-risks" role="tabpanel" aria-labelledby="nav-tab-risks">
              <RiskAuditView
                data={riskAuditData}
                isLoading={isAuditingRisks}
              />
            </div>
          )}

          {activeTab === "compare" && (
            <div id="tabpanel-compare" role="tabpanel" aria-labelledby="nav-tab-compare">
              <ComparatorView
                onRunCompare={handleCompareDocuments}
                isComparing={isComparing}
                comparisonResult={comparisonResult}
              />
            </div>
          )}

          {activeTab === "qa" && (
            <div id="tabpanel-qa" role="tabpanel" aria-labelledby="nav-tab-qa">
              <QAView
                onAskQuestion={handleAskQuestion}
                isAnswering={isAnsweringQA}
                history={qaHistory}
                hasDocument={!!documentText.trim()}
              />
            </div>
          )}

          {activeTab === "preppacket" && (
            <div id="tabpanel-preppacket" role="tabpanel" aria-labelledby="nav-tab-preppacket">
              <PrepPacketView
                data={prepPacketData}
                isLoading={isPreppingPacket}
                onGenerate={handleGeneratePrepPacket}
                hasDocument={!!documentText.trim()}
                userConcerns={userConcerns}
                onUserConcernsChange={setUserConcerns}
              />
            </div>
          )}
        </ErrorBoundary>
      </main>

      {/* Floating Co-Pilot Action Button */}
      <button
        id="floating-btn-copilot"
        type="button"
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 hover:scale-105 transition-all group cursor-pointer focus:ring-2 focus:ring-amber-500 outline-hidden"
        aria-label="Open Smart Legal Assistant Co-Pilot"
      >
        <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold hidden sm:inline">Ask Co-Pilot</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">Legal Document Assistant & Navigator</span>
            <span>•</span>
            <span>Educational Legal Literacy Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-xl mx-auto">
            Powered by Google Gemini 3 series models with automated multi-tier fallback resilience. Not intended to serve as formal attorney representation. Always seek licensed local counsel for high-stakes legal proceedings.
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SampleDocumentsModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={handleSelectSample}
      />

      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        savedItems={savedSessions}
        onRestore={handleRestoreSession}
        onDelete={handleDeleteSession}
        onClearAll={handleClearAllSessions}
      />

      <SmartAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        documentText={documentText}
        userRole={userRole}
        currentTab={activeTab}
      />
    </div>
  );
}
