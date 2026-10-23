import type { DocumentEntityType, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import type { LinkSponsorDeps } from '@/server/sponsorship/link-sponsor'
import { activityLogRepository } from './activity-log.repository'

type Kind = 'pharmacy' | 'candidate'

function displayName(row: {
  name?: string
  firstName?: string
  lastName?: string
}): string {
  if (row.name) return row.name
  return `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim()
}

export function makeSponsorshipLinkDeps(
  kind: Kind,
  db: PrismaClient = defaultDb,
): LinkSponsorDeps {
  const entityType: DocumentEntityType = kind === 'pharmacy' ? 'PHARMACY' : 'CANDIDATE'
  return {
    findActive: async (id) => {
      if (kind === 'pharmacy') {
        const row = await db.pharmacy.findFirst({
          where: { id, ...NOT_DELETED },
          select: { id: true, name: true, sponsorId: true },
        })
        return row
      }
      const row = await db.candidate.findFirst({
        where: { id, ...NOT_DELETED },
        select: { id: true, firstName: true, lastName: true, sponsorId: true },
      })
      return row ? { id: row.id, name: displayName(row), sponsorId: row.sponsorId } : null
    },
    findSponsorId: async (id) => {
      if (kind === 'pharmacy') {
        const row = await db.pharmacy.findFirst({
          where: { id, ...NOT_DELETED },
          select: { sponsorId: true },
        })
        return row?.sponsorId ?? null
      }
      const row = await db.candidate.findFirst({
        where: { id, ...NOT_DELETED },
        select: { sponsorId: true },
      })
      return row?.sponsorId ?? null
    },
    setSponsorId: async (filleuleId, sponsorId) => {
      if (kind === 'pharmacy') {
        await db.pharmacy.update({ where: { id: filleuleId }, data: { sponsorId } })
        return
      }
      await db.candidate.update({ where: { id: filleuleId }, data: { sponsorId } })
    },
    logActivity: async ({ entityId, authorId, content }) => {
      await activityLogRepository.create({
        entityType,
        entityId,
        authorId,
        type: 'NOTE',
        content,
      })
    },
  }
}
