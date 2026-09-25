/**
 * Utility functions for input validation, sanitization, PII protection, and prompt injection defense.
 */

export interface ValidationResult<T> {
  isValid: boolean;
  value: T;
  error?: string;
  piiRedactedCount?: number;
}

/**
 * Redacts Personally Identifiable Information (PII) such as SSNs, Credit Cards,
 * Emails, and Phone Numbers before sending text to external LLMs.
 */
export function redactPII(text: string): { redactedText: string; count: number } {
  let count = 0;
  let result = text;

  // 1. Social Security Numbers (SSN): XXX-XX-XXXX
  result = result.replace(/\b\d{3}-\d{2}-\d{4}\b/g, () => {
    count++;
    return "[REDACTED SSN]";
  });

  // 2. Credit Card Numbers (13-16 digits with optional spaces or dashes)
  result = result.replace(/\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g, () => {
    count++;
    return "[REDACTED CREDIT CARD]";
  });

  // 3. Email Addresses
  result = result.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, () => {
    count++;
    return "[REDACTED EMAIL]";
  });

  // 4. US/International Phone Numbers
  result = result.replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, () => {
    count++;
    return "[REDACTED PHONE]";
  });

  return { redactedText: result, count };
}

/**
 * Validates and sanitizes untrusted legal document text input.
 */
export function validateDocumentText(
  input: unknown,
  maxLength = 100000,
  shouldRedactPII = true
): ValidationResult<string> {
  if (typeof input !== "string") {
    return {
      isValid: false,
      value: "",
      error: "Document content must be a valid text string.",
    };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      value: "",
      error: "Document text cannot be empty.",
    };
  }

  // Strip null bytes and control characters (except common whitespace \n, \r, \t)
  let sanitized = trimmed
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .slice(0, maxLength);

  let piiRedactedCount = 0;
  if (shouldRedactPII) {
    const piiResult = redactPII(sanitized);
    sanitized = piiResult.redactedText;
    piiRedactedCount = piiResult.count;
  }

  return {
    isValid: true,
    value: sanitized,
    piiRedactedCount,
  };
}

/**
 * Encapsulates untrusted document text safely inside structured XML-like tags to prevent prompt injection.
 */
export function formatUntrustedDocument(documentText: string): string {
  // Escape potential closing prompt injection tags in the text
  const escapedText = documentText
    .replace(/<\/untrusted_document>/gi, "&lt;/untrusted_document&gt;")
    .replace(/<system_instruction>/gi, "&lt;system_instruction&gt;")
    .replace(/<\/system_instruction>/gi, "&lt;/system_instruction&gt;")
    .replace(/<untrusted_question>/gi, "&lt;untrusted_question&gt;")
    .replace(/<\/untrusted_question>/gi, "&lt;/untrusted_question&gt;");

  return `<untrusted_document>\n${escapedText}\n</untrusted_document>`;
}

/**
 * Escapes HTML characters to prevent XSS vulnerability when displaying raw string outputs.
 */
export function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates role or reading level strings against allowed enums.
 */
export function validateEnum<T extends string>(
  input: unknown,
  allowedValues: readonly T[],
  defaultValue: T
): T {
  if (typeof input === "string" && allowedValues.includes(input as T)) {
    return input as T;
  }
  return defaultValue;
}
