import type { JobOfferStatus } from '@prisma/client'

export type JobOfferListEntity = {
  id: string
  title: string
  status: JobOfferStatus
  publishedAt: Date | null
  mission: { id: string; title: string }
  _count: { applications: number }
}

export type JobOfferListRow = {
  id: string
  title: string
  status: JobOfferStatus
  publishedAt: Date | null
  missionId: string
  missionTitle: string
  applicationCount: number
}

export function toJobOfferListRow(entity: JobOfferListEntity): JobOfferListRow {
  return {
    id: entity.id,
    title: entity.title,
    status: entity.status,
    publishedAt: entity.publishedAt,
    missionId: entity.mission.id,
    missionTitle: entity.mission.title,
    applicationCount: entity._count.applications,
  }
}
