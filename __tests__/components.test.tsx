import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { FocusTrap } from "@/components/FocusTrap";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
    // Suppress console.error during expected crash test
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
