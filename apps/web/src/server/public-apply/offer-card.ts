import type { ContractType, JobOfferStatus } from '@prisma/client'
import { CONTRACT_TYPE_LABELS } from '@/lib/candidate-options'

export type PublicOfferCard = {
  boardListingId: string
  title: string
  jobTitleName: string
  city: string
  contractLabel: string
  status: JobOfferStatus
  jobOfferId: string
  jobTitleId: string
}

export type OfferLookupRow = {
  id: string
  boardListingId: string | null
  title: string
  status: JobOfferStatus
  city: string | null
  jobTitleName: string | null
  jobTitleId: string | null
  contractType: ContractType | null
  jobTitle: { id: string; name: string } | null
  mission: {
    contractType: ContractType
    jobTitle: { id: string; name: string }
    pharmacy: { city: string | null }
  } | null
}

export function toPublicOfferCard(row: OfferLookupRow): PublicOfferCard | null {
  if (!row.boardListingId) return null
  const jobTitleId = row.mission?.jobTitle.id ?? row.jobTitleId ?? row.jobTitle?.id
  const jobTitleName =
    row.mission?.jobTitle.name ?? row.jobTitleName ?? row.jobTitle?.name
  if (!jobTitleId || !jobTitleName) return null
  const city = row.mission?.pharmacy.city ?? row.city ?? 'Non précisée'
  const contract = row.mission?.contractType ?? row.contractType
  if (!contract) return null
  return {
    boardListingId: row.boardListingId,
    title: row.title,
    jobTitleName,
    city,
    contractLabel: CONTRACT_TYPE_LABELS[contract],
    status: row.status,
    jobOfferId: row.id,
    jobTitleId,
  }
}

export function publicOfferView(card: PublicOfferCard) {
  return {
    title: card.title,
    jobTitleName: card.jobTitleName,
    city: card.city,
    contractLabel: card.contractLabel,
    available: card.status === 'PUBLIEE',
  }
}
