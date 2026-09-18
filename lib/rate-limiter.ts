import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number; // Max requests
  windowMs?: number; // Time window in ms
}

/**
 * Checks and enforces sliding window rate limiting for an IP address.
 * Returns null if allowed, or a NextResponse 429 if limit exceeded.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): NextResponse | null {
  const limit = options.limit ?? 30; // 30 requests per window by default
  const windowMs = options.windowMs ?? 60 * 1000; // 1 minute window

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(ip, record);
  }

  // Filter timestamps within window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const retryAfter = Math.ceil(
      (record.timestamps[0] + windowMs - now) / 1000
    );
    return NextResponse.json(
      {
        success: false,
        error: "Too many requests. Please slow down and try again.",
        retryAfterSeconds: Math.max(1, retryAfter),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, retryAfter)),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  record.timestamps.push(now);
  return null;
}
