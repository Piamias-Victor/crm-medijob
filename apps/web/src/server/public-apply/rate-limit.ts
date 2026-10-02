export const PUBLIC_APPLY_RATE_LIMIT = 5
export const PUBLIC_APPLY_RATE_WINDOW_MS = 60 * 60 * 1000

export type RateLimitBucket = {
  count: number
  windowStartedAt: Date
}

export function rateLimitDecision(
  bucket: RateLimitBucket | null,
  now: Date,
  limit = PUBLIC_APPLY_RATE_LIMIT,
  windowMs = PUBLIC_APPLY_RATE_WINDOW_MS,
): { allowed: boolean; nextCount: number; windowStartedAt: Date } {
  if (!bucket || now.getTime() - bucket.windowStartedAt.getTime() >= windowMs) {
    return { allowed: true, nextCount: 1, windowStartedAt: now }
  }
  if (bucket.count >= limit) {
    return { allowed: false, nextCount: bucket.count, windowStartedAt: bucket.windowStartedAt }
  }
  return {
    allowed: true,
    nextCount: bucket.count + 1,
    windowStartedAt: bucket.windowStartedAt,
  }
}
