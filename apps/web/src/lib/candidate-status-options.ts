import type { CandidateStatus } from '@/view-models/candidate-status'
import { MANUAL_CANDIDATE_STATUSES } from '@/view-models/candidate-status'

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  NOUVEAU: 'Nouveau',
  A_QUALIFIER: 'À qualifier',
  QUALIFIE: 'Qualifié',
  EN_MISSION: 'En mission',
  INACTIF: 'Inactif',
  BLACKLISTE: 'Blacklisté',
}

export const CANDIDATE_STATUS_BADGE: Record<
  CandidateStatus,
  'success' | 'warning' | 'error' | 'default' | 'sky'
> = {
  NOUVEAU: 'sky',
  A_QUALIFIER: 'warning',
  QUALIFIE: 'success',
  EN_MISSION: 'success',
  INACTIF: 'default',
  BLACKLISTE: 'error',
}

export const MANUAL_CANDIDATE_STATUS_OPTIONS = MANUAL_CANDIDATE_STATUSES.map((status) => ({
  value: status,
  label: CANDIDATE_STATUS_LABELS[status],
}))
