import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as simplifyHandler } from "@/app/api/legal/simplify/route";
import { POST as riskAuditHandler } from "@/app/api/legal/risk-audit/route";
import { POST as compareHandler } from "@/app/api/legal/compare/route";
import { POST as qaHandler } from "@/app/api/legal/qa/route";
import { POST as prepPacketHandler } from "@/app/api/legal/prep-packet/route";
import { POST as assistantHandler } from "@/app/api/legal/assistant/route";

// Mock the gemini-resilience generateContentWithFallback function
vi.mock("@/lib/gemini-resilience", () => ({
  generateContentWithFallback: vi.fn().mockImplementation(async () => {
    return {
      text: JSON.stringify({
        executiveSummary: "Mock executive summary of the agreement.",
        overallRiskScore: 45,
        riskRating: "Moderate",
        directAnswer: "Mock answer with citations.",
        overallComparison: "Mock contract comparison result.",
        intakeSummary: { documentType: "Lease" },
        assistantMessage: "Mock strategic co-pilot message.",
      }),
      modelUsed: "gemini-3.6-flash",
      attempts: 1,
    };
  }),
}));

describe("API Route Handlers", () => {
  it("POST /api/legal/simplify returns 400 when document text is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/legal/simplify", {
      method: "POST",
      body: JSON.stringify({ documentText: "" }),
    });
    const res = await simplifyHandler(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("POST /api/legal/simplify succeeds with valid input", async () => {
    const req = new NextRequest("http://localhost:3000/api/legal/simplify", {
      method: "POST",
      headers: { "x-forwarded-for": "10.0.0.1" },
      body: JSON.stringify({
        documentText: "Tenant agrees to pay $2,000 monthly rent on the 1st day of each month.",
        readingLevel: "plain",
        partyPerspective: "Tenant",
      }),
    });
    const res = await simplifyHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.executiveSummary).toBeDefined();
  });

  it("POST /api/legal/risk-audit returns 400 for empty text", async () => {
    const req = new NextRequest("http://localhost:3000/api/legal/risk-audit", {
      method: "POST",
      body: JSON.stringify({ documentText: "" }),
    });
    const res = await riskAuditHandler(req);
    expect(res.status).toBe(400);
  });

  it("POST /api/legal/risk-audit succeeds with valid contract text", async () => {
    const req = new NextRequest("http://localhost:3000/api/legal/risk-audit", {
      method: "POST",
      headers: { "x-forwarded-for": "10.0.0.2" },
      body: JSON.stringify({
        documentText: "Landlord reserves the right to enter premises at any time without notice.",
        userRole: "Tenant",
      }),
    });
    const res = await riskAuditHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.overallRiskScore).toBe(45);
  });

  it("POST /api/legal/compare returns 400 if one document is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/legal/compare", {
      method: "POST",
      body: JSON.stringify({ docAText: "Only doc A provided" }),
    });
    const res = await compareHandler(req);
    expect(res.status).toBe(400);
  });

  it("POST /api/legal/qa returns 400 if question is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/legal/qa", {
      method: "POST",
      body: JSON.stringify({ documentText: "Some contract text", question: "" }),
    });
    const res = await qaHandler(req);
    expect(res.status).toBe(400);
  });

  it("POST /api/legal/prep-packet succeeds with valid input", async () => {
    const req = new NextRequest("http://localhost:3000/api/legal/prep-packet", {
      method: "POST",
      headers: { "x-forwarded-for": "10.0.0.3" },
      body: JSON.stringify({
        documentText: "Independent Contractor Agreement with non-compete clause.",
        userRole: "Contractor",
      }),
    });
    const res = await prepPacketHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("POST /api/legal/assistant succeeds with valid user message", async () => {
    const req = new NextRequest("http://localhost:3000/api/legal/assistant", {
      method: "POST",
      headers: { "x-forwarded-for": "10.0.0.4" },
      body: JSON.stringify({
        documentText: "Employment contract text",
        userRole: "Employee",
        userMessage: "What leverage do I have?",
      }),
    });
    const res = await assistantHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
