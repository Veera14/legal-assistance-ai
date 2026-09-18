import crypto from "crypto";

interface CacheEntry<T> {
  data: T;
  meta: {
    modelUsed: string;
    attempts: number | string[];
    cachedAt: number;
  };
  expiresAt: number;
}

const apiCache = new Map<string, CacheEntry<unknown>>();

/**
 * Computes a deterministic hash key for an API payload.
 */
export function computeCacheKey(prefix: string, payload: unknown): string {
  const serialized = JSON.stringify(payload);
  const hash = crypto.createHash("sha256").update(serialized).digest("hex");
  return `${prefix}:${hash}`;
}

/**
 * Retrieves a cached API response if present and not expired.
 */
export function getCachedResponse<T>(key: string): CacheEntry<T> | null {
  const entry = apiCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    apiCache.delete(key);
    return null;
  }

  return entry;
}

/**
 * Stores an API response in the in-memory cache.
 * Default TTL: 1 hour (3600000 ms).
 */
export function setCachedResponse<T>(
  key: string,
  data: T,
  meta: { modelUsed: string; attempts: number | string[] },
  ttlMs: number = 60 * 60 * 1000
): void {
  if (apiCache.size > 200) {
    const oldestKey = apiCache.keys().next().value;
    if (oldestKey) apiCache.delete(oldestKey);
  }

  const now = Date.now();
  apiCache.set(key, {
    data,
    meta: {
      ...meta,
      cachedAt: now,
    },
    expiresAt: now + ttlMs,
  });
}

/**
 * Clears the entire API cache (useful for testing or cache invalidation).
 */
export function clearApiCache(): void {
  apiCache.clear();
}
