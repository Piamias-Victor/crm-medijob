import type { BadakanProposalStatus } from '@prisma/client'

export type BadakanProposalSource = {
  id: string
  badakanMissionId: string
  candidateId: string
  status: BadakanProposalStatus
  score: number | null
  justification: string | null
  candidate: {
    id: string
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
    city: string | null
    jobTitle: { name: string }
  }
}

export type BadakanProposalListItem = {
  id: string
  missionId: string
  candidateId: string
  fullName: string
  jobTitle: string
  city: string | null
  email: string | null
  phone: string | null
  status: BadakanProposalStatus
  statusLabel: string
  score: number | null
  justification: string | null
}

const STATUS_LABELS: Record<BadakanProposalStatus, string> = {
  PROPOSE: 'Proposé',
  VALIDE: 'Validé',
  REFUSE: 'Refusé',
}

export function badakanProposalStatusLabel(status: BadakanProposalStatus): string {
  return STATUS_LABELS[status]
}

export function toBadakanProposalListItem(row: BadakanProposalSource): BadakanProposalListItem {
  return {
    id: row.id,
    missionId: row.badakanMissionId,
    candidateId: row.candidateId,
    fullName: `${row.candidate.firstName} ${row.candidate.lastName}`.trim(),
    jobTitle: row.candidate.jobTitle.name,
    city: row.candidate.city,
    email: row.candidate.email,
    phone: row.candidate.phone,
    status: row.status,
    statusLabel: badakanProposalStatusLabel(row.status),
    score: row.score,
    justification: row.justification,
  }
}
