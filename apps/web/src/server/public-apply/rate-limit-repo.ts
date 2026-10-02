import { createHash } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'
import { rateLimitDecision } from '@/server/public-apply/rate-limit'

export function hashPublicApplyIp(ip: string) {
  return createHash('sha256').update(ip).digest('hex')
}

export function makePublicApplyRateLimitRepo(db: PrismaClient) {
  return {
    async consume(ip: string, now = new Date()) {
      const ipHash = hashPublicApplyIp(ip)
      const existing = await db.publicApplyRateLimit.findUnique({ where: { ipHash } })
      const decision = rateLimitDecision(
        existing
          ? { count: existing.count, windowStartedAt: existing.windowStartedAt }
          : null,
        now,
      )
      if (!decision.allowed) return { allowed: false as const }
      await db.publicApplyRateLimit.upsert({
        where: { ipHash },
        create: {
          ipHash,
          count: decision.nextCount,
          windowStartedAt: decision.windowStartedAt,
        },
        update: {
          count: decision.nextCount,
          windowStartedAt: decision.windowStartedAt,
        },
      })
      return { allowed: true as const }
    },
  }
}
