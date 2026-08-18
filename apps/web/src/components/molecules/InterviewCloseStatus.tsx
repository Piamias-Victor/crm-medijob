'use client'

import { CheckboxChip } from '@/components/molecules/CheckboxChip'
import { SectionCard } from '@/components/molecules/SectionCard'
import { INTERVIEW_BLACKLIST, INTERVIEW_STATUS_TITLE } from '@/view-models/interview-copy'

type Props = {
  blacklist: boolean
  showBlacklist: boolean
  onBlacklist: (value: boolean) => void
}

export function InterviewCloseStatus({ blacklist, showBlacklist, onBlacklist }: Props) {
  if (!showBlacklist) return null
  return (
    <SectionCard variant="glass" title={INTERVIEW_STATUS_TITLE} bodyClassName="flex flex-wrap gap-2 p-4 sm:p-5">
      <CheckboxChip label={INTERVIEW_BLACKLIST} checked={blacklist} onChange={onBlacklist} />
    </SectionCard>
  )
}
