import type { JobOfferStatus } from '@prisma/client'

export type JobOfferListEntity = {
  id: string
  title: string
  status: JobOfferStatus
  publishedAt: Date | null
  mission: { id: string; title: string } | null
  _count: { applications: number }
}

export type JobOfferListRow = {
  id: string
  title: string
  status: JobOfferStatus
  publishedAt: Date | null
  missionId: string | null
  missionTitle: string | null
  source: 'mission' | 'standalone'
  applicationCount: number
}

export function toJobOfferListRow(entity: JobOfferListEntity): JobOfferListRow {
  return {
    id: entity.id,
    title: entity.title,
    status: entity.status,
    publishedAt: entity.publishedAt,
    missionId: entity.mission?.id ?? null,
    missionTitle: entity.mission?.title ?? null,
    source: entity.mission ? 'mission' : 'standalone',
    applicationCount: entity._count.applications,
  }
}
