import type { LucideIcon } from 'lucide-react'
import { Ban } from 'lucide-react'
import type { CandidateStatus } from '@/view-models/candidate-status'

export function candidateBlacklistHeaderChips(
  status: CandidateStatus,
): Array<{ icon: LucideIcon; label: string; tone: 'accent' }> | undefined {
  if (status !== 'BLACKLISTE') return undefined
  return [{ icon: Ban, label: 'Blacklisté', tone: 'accent' }]
}
