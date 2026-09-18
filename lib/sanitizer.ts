/**
 * Utility functions for input validation, sanitization, and prompt injection defense.
 */

export interface ValidationResult<T> {
  isValid: boolean;
  value: T;
  error?: string;
}

/**
 * Validates and sanitizes untrusted legal document text input.
 */
export function validateDocumentText(
  input: unknown,
  maxLength = 100000
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
  const sanitized = trimmed
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .slice(0, maxLength);

  return {
    isValid: true,
    value: sanitized,
  };
}

/**
 * Encapsulates untrusted document text safely inside structured XML-like tags to prevent prompt injection.
 */
export function formatUntrustedDocument(documentText: string): string {
  // Escape potential closing prompt injection tags in the text
  const escapedText = documentText
    .replace(/<\/untrusted_document>/gi, "&lt;/untrusted_document&gt;")
    .replace(/<system_instruction>/gi, "&lt;system_instruction&gt;");

  return `<untrusted_document>\n${escapedText}\n</untrusted_document>`;
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
