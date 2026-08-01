import type { ManualCandidateStatus } from '@/view-models/candidate-status'
import { MANUAL_CANDIDATE_STATUSES } from '@/view-models/candidate-status'
import { CANDIDATE_STATUS_LABELS } from '@/lib/candidate-status-options'

const LABEL_TO_STATUS = Object.fromEntries(
  MANUAL_CANDIDATE_STATUSES.map((status) => [
    CANDIDATE_STATUS_LABELS[status].toLowerCase(),
    status,
  ]),
) as Record<string, ManualCandidateStatus>

export function parseCandidateCsvStatus(raw: string | undefined): ManualCandidateStatus | undefined {
  if (raw === undefined || raw.trim() === '') return undefined
  const trimmed = raw.trim()
  const upper = trimmed.toUpperCase().replace(/\s+/g, '_')
  if ((MANUAL_CANDIDATE_STATUSES as readonly string[]).includes(upper)) {
    return upper as ManualCandidateStatus
  }
  return LABEL_TO_STATUS[trimmed.toLowerCase()]
}
