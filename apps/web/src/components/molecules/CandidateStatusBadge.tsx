import { Badge } from '@/components/atoms/Badge'
import { CANDIDATE_STATUS_BADGE, CANDIDATE_STATUS_LABELS } from '@/lib/candidate-status-options'
import type { CandidateStatus } from '@/view-models/candidate-status'

export function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  return <Badge variant={CANDIDATE_STATUS_BADGE[status]}>{CANDIDATE_STATUS_LABELS[status]}</Badge>
}
