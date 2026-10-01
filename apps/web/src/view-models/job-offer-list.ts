import type { JobOfferStatus } from '@prisma/client'

export type JobOfferListEntity = {
  id: string
  title: string
  status: JobOfferStatus
  publishedAt: Date | null
  latitude: number | null
  longitude: number | null
  city: string | null
  mission: {
    id: string
    title: string
    pharmacy: { latitude: number | null; longitude: number | null; city: string | null }
  } | null
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
  latitude: number | null
  longitude: number | null
  city: string | null
}

export function toJobOfferListRow(entity: JobOfferListEntity): JobOfferListRow {
  const pharmacy = entity.mission?.pharmacy
  return {
    id: entity.id,
    title: entity.title,
    status: entity.status,
    publishedAt: entity.publishedAt,
    missionId: entity.mission?.id ?? null,
    missionTitle: entity.mission?.title ?? null,
    source: entity.mission ? 'mission' : 'standalone',
    applicationCount: entity._count.applications,
    latitude: entity.latitude ?? pharmacy?.latitude ?? null,
    longitude: entity.longitude ?? pharmacy?.longitude ?? null,
    city: entity.city ?? pharmacy?.city ?? null,
  }
}
