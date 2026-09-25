import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { FocusTrap } from "@/components/FocusTrap";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Header } from "@/components/Header";
import { DocumentInput } from "@/components/DocumentInput";
import { SimplifierView } from "@/components/SimplifierView";
import { RiskAuditView } from "@/components/RiskAuditView";
import { ComparatorView } from "@/components/ComparatorView";
import { QAView } from "@/components/QAView";
import { PrepPacketView } from "@/components/PrepPacketView";

describe("AccessibilityBar Component", () => {
  it("renders font size buttons and contrast toggle", () => {
    const onChangeFontSize = vi.fn();
    const onToggleHighContrast = vi.fn();

    render(
      <AccessibilityBar
        fontSizeLevel="normal"
        onChangeFontSize={onChangeFontSize}
        highContrast={false}
        onToggleHighContrast={onToggleHighContrast}
      />
    );

    expect(screen.getByText("Accessibility & Comfort")).toBeInTheDocument();
    const fontLargeBtn = screen.getByRole("button", { name: "Large Font Size" });
    expect(fontLargeBtn).toBeInTheDocument();

    fireEvent.click(fontLargeBtn);
    expect(onChangeFontSize).toHaveBeenCalledWith("large");

    const contrastBtn = screen.getByRole("button", { name: "Toggle High Contrast Mode" });
    fireEvent.click(contrastBtn);
    expect(onToggleHighContrast).toHaveBeenCalled();
  });
});

describe("Header Component", () => {
  it("renders workflow navigation tabs with proper accessible roles", () => {
    const onTabChange = vi.fn();
    render(
      <Header
        activeTab="simplify"
        onTabChange={onTabChange}
        hasDocument={true}
        onOpenSamples={vi.fn()}
        savedCount={2}
        onOpenHistory={vi.fn()}
        onOpenAssistant={vi.fn()}
      />
    );

    const tabList = screen.getByRole("tablist");
    expect(tabList).toBeInTheDocument();

    const simplifyTab = screen.getByRole("tab", { name: /Simplify/i });
    expect(simplifyTab).toHaveAttribute("aria-selected", "true");

    const riskTab = screen.getByRole("tab", { name: /Risk/i });
    fireEvent.click(riskTab);
    expect(onTabChange).toHaveBeenCalledWith("risks");
  });
});

describe("DocumentInput Component", () => {
  it("renders textarea and triggers onDocumentChange and onRunAnalysis", () => {
    const onDocumentChange = vi.fn();
    const onRunAnalysis = vi.fn();

    render(
      <DocumentInput
        documentText="Sample Lease Text"
        onDocumentChange={onDocumentChange}
        userRole="Tenant"
        onUserRoleChange={vi.fn()}
        documentTitle="Residential Lease"
        onDocumentTitleChange={vi.fn()}
        onRunAnalysis={onRunAnalysis}
        isAnalyzing={false}
        activeActionLabel="Translate to Plain English"
      />
    );

    const textarea = screen.getByPlaceholderText(/Paste full agreement text/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Sample Lease Text");

    const runBtn = screen.getByRole("button", { name: /Translate to Plain English/i });
    fireEvent.click(runBtn);
    expect(onRunAnalysis).toHaveBeenCalled();
  });
});

describe("SimplifierView Component", () => {
  it("renders simplified data and jargon glossary", () => {
    const data = {
      executiveSummary: "Clear summary of the lease.",
      readingLevelUsed: "plain",
      coreParties: [
        {
          name: "Landlord",
          role: "Property Owner",
          primaryObligations: ["Provide habitable dwelling"],
          rights: ["Collect rent"],
        },
      ],
      keyTermsExplained: [
        {
          term: "Indemnify",
          originalContext: "Tenant agrees to indemnify Landlord...",
          plainEnglishMeaning: "Cover losses or legal fees",
          practicalImpact: "Pay for damages",
        },
      ],
      clauseBreakdown: [
        {
          title: "Rent Obligations",
          originalSnippet: "Rent due on 1st",
          simplifiedExplanation: "Pay rent every month on the 1st",
          importance: "critical" as const,
        },
      ],
      immediateActionItems: ["Check move-in date"],
    };

    render(
      <SimplifierView
        data={data}
        readingLevel="plain"
        onReadingLevelChange={vi.fn()}
        isLoading={false}
        onReSimplify={vi.fn()}
      />
    );

    expect(screen.getByText("Clear summary of the lease.")).toBeInTheDocument();
    expect(screen.getByText("Landlord")).toBeInTheDocument();
    expect(screen.getByText("Indemnify")).toBeInTheDocument();
  });
});

describe("RiskAuditView Component", () => {
  it("renders risk score badge and critical risk cards", () => {
    const data = {
      overallRiskScore: 75,
      riskRating: "High" as const,
      riskSummary: "Predatory lease clauses found.",
      redFlagTraps: [
        {
          trapName: "Auto-Renewal Trap",
          detected: true,
          severity: "critical" as const,
          excerpt: "Renews automatically unless 90 days notice",
          dangerExplanation: "Easy to miss deadline",
        },
      ],
      criticalRisks: [
        {
          id: "r-1",
          clauseTitle: "Unilateral Access",
          severity: "critical" as const,
          clauseQuote: "Landlord enters anytime",
          issue: "No notice required",
          worstCaseScenario: "Loss of privacy",
          recommendedRevision: "Require 24 hours notice",
        },
      ],
      mediumRisks: [],
      oneSidedObligations: [],
      safeguardsPresent: ["Quiet enjoyment clause"],
    };

    render(<RiskAuditView data={data} isLoading={false} />);

    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("High Risk Exposure")).toBeInTheDocument();
    expect(screen.getByText("Auto-Renewal Trap")).toBeInTheDocument();
  });
});

describe("ComparatorView Component", () => {
  it("renders dual input area and comparison button", () => {
    const onRunCompare = vi.fn();
    render(<ComparatorView onRunCompare={onRunCompare} isComparing={false} comparisonResult={null} />);

    expect(screen.getByText("Side-by-Side Contract & Policy Comparator")).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: /Run Side-by-Side Comparison/i });
    expect(btn).toBeInTheDocument();
  });
});

describe("QAView Component", () => {
  it("renders grounded Q&A question input and chip suggestions", () => {
    const onAskQuestion = vi.fn();
    render(<QAView onAskQuestion={onAskQuestion} isAnswering={false} history={[]} hasDocument={true} />);

    expect(screen.getByText("Grounded Legal Q&A Navigator")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask a question/i)).toBeInTheDocument();
  });
});

describe("PrepPacketView Component", () => {
  it("renders lawyer consultation prep packet controls", () => {
    const onGenerate = vi.fn();
    render(
      <PrepPacketView
        data={null}
        isLoading={false}
        onGenerate={onGenerate}
        hasDocument={true}
        userConcerns=""
        onUserConcernsChange={vi.fn()}
      />
    );

    expect(screen.getByText("Lawyer Consultation Prep & Checklist Engine")).toBeInTheDocument();
  });
});

describe("FocusTrap Component", () => {
  it("renders children and triggers onEscape on Escape key press", () => {
    const onEscape = vi.fn();
    render(
      <FocusTrap isActive={true} onEscape={onEscape}>
        <button>Inside Trap Button</button>
      </FocusTrap>
    );

    expect(screen.getByText("Inside Trap Button")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onEscape).toHaveBeenCalled();
  });
});

describe("ErrorBoundary Component", () => {
  const ProblemComponent = () => {
    throw new Error("Test component crash");
  };

  it("catches rendering errors gracefully and shows error UI", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test component crash")).toBeInTheDocument();

    spy.mockRestore();
  });
});
