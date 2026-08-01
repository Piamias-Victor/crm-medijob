import { vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'

type MissionWhere = {
  status?: string | { in?: string[]; not?: string }
  startDate?: unknown
  candidates?: unknown
}

export type DashboardDbOverrides = {
  uncovered?: { id: string; title: string }[]
  untreated?: { id: string; firstName: string; lastName: string }[]
  openMissions?: {
    id: string
    title: string
    createdAt: Date
    activities: { date: Date }[]
  }[]
}

export function makeDashboardTestDb(overrides: DashboardDbOverrides = {}): PrismaClient {
  const uncovered = overrides.uncovered ?? []
  const untreated = overrides.untreated ?? []
  const openMissions = overrides.openMissions ?? []

  const missionCount = vi.fn().mockImplementation(async ({ where }: { where: MissionWhere }) => {
    if (where.status === 'A_POURVOIR') return 3
    if (where.status === 'POURVU') return 4
    if (where.status && typeof where.status === 'object' && where.status.not === 'ANNULEE') {
      return 10
    }
    if (where.startDate) return 1
    if (where.candidates) return uncovered.length
    return 0
  })

  return {
    candidate: { count: vi.fn().mockResolvedValue(10) },
    pharmacy: { count: vi.fn().mockResolvedValue(5) },
    mission: {
      count: missionCount,
      findMany: vi.fn().mockResolvedValueOnce(uncovered).mockResolvedValueOnce(openMissions),
    },
    application: {
      count: vi.fn().mockResolvedValue(2),
      findMany: vi.fn().mockResolvedValue(untreated),
    },
  } as unknown as PrismaClient
}
