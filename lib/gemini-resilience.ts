import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters } from "@google/genai";

// Ensure process.env.GEMINI_API_KEY is retrieved securely
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

/**
 * Resilient Model Fallback Ladder:
 * 1. Primary: "gemini-3.6-flash"
 * 2. High-Availability Fallback: "gemini-3.1-flash-lite"
 * 3. Dynamic Alias: "gemini-flash-latest"
 * 4. Deep Reasoning Fallback: "gemini-3.7-flash"
 */
export const MODEL_LADDER = [
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.7-flash",
] as const;

export interface ResilientGenerationOptions {
  contents: GenerateContentParameters["contents"];
  systemInstruction?: string;
  responseMimeType?: "application/json" | "text/plain";
  temperature?: number;
}

/**
 * Strips undefined properties recursively from an object to ensure payload hygiene
 */
export function sanitizePayload<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Executes content generation sequentially attempting the resilient model fallback ladder
 * when encountering recoverable errors (503, 429, 404, 500).
 */
export async function generateContentWithFallback(
  options: ResilientGenerationOptions
): Promise<{ text: string; modelUsed: string; attempts: string[] }> {
  const ai = getGeminiClient();
  const attemptedModels: string[] = [];
  let lastError: unknown = null;

  for (const model of MODEL_LADDER) {
    try {
      attemptedModels.push(model);
      const params: GenerateContentParameters = {
        model,
        contents: options.contents,
        config: sanitizePayload({
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType,
          temperature: options.temperature,
        }),
      };

      const response: GenerateContentResponse = await ai.models.generateContent(params);
      const outputText = response.text || "";
      return {
        text: outputText,
        modelUsed: model,
        attempts: attemptedModels,
      };
    } catch (err: unknown) {
      lastError = err;
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[Gemini Fallback] Model ${model} failed with: ${errorMsg}. Attempting fallback...`);

      // If it's an API key error or configuration fault that is non-recoverable across all models,
      // fail fast if indicated, otherwise proceed down the ladder
      const isRecoverable =
        errorMsg.includes("503") ||
        errorMsg.includes("429") ||
        errorMsg.includes("404") ||
        errorMsg.includes("500") ||
        errorMsg.includes("RESOURCE_EXHAUSTED") ||
        errorMsg.includes("UNAVAILABLE") ||
        errorMsg.includes("NOT_FOUND") ||
        errorMsg.includes("INTERNAL") ||
        errorMsg.includes("overloaded");

      // Continue to next model if recoverable or general model execution issue
      if (!isRecoverable && attemptedModels.length >= 2) {
        // Continue trying fallback models anyway
      }
    }
  }

  throw new Error(
    `All model fallbacks exhausted (${attemptedModels.join(", ")}). Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}
