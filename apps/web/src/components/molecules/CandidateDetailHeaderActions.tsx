'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { CandidateGdprEraseButton } from '@/components/molecules/CandidateGdprEraseButton'
import { CopyWeeklyAvailabilityLinkButton } from '@/components/molecules/CopyWeeklyAvailabilityLinkButton'
import { ResendWeeklyAvailabilitySmsButton } from '@/components/molecules/ResendWeeklyAvailabilitySmsButton'
import { canCopyWeeklyAvailabilityLink } from '@/view-models/weekly-availability-slots'
import { accentButtonClassName } from '@/lib/button-styles'
import { INTERVIEW_CTA } from '@/view-models/interview-copy'
import { interviewStartPath } from '@/view-models/interview-href'

type Props = { candidateId: string; candidateName: string; origin: 'APP' | 'CRM' }

export function CandidateDetailHeaderActions({ candidateId, candidateName, origin }: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {canCopyWeeklyAvailabilityLink(origin) ? (
        <>
          <CopyWeeklyAvailabilityLinkButton candidateId={candidateId} />
          <ResendWeeklyAvailabilitySmsButton candidateId={candidateId} />
        </>
      ) : null}
      <Link href={interviewStartPath(candidateId)} className={accentButtonClassName}>
        <Plus className="size-4" />
        {INTERVIEW_CTA}
      </Link>
      <CandidateGdprEraseButton candidateId={candidateId} candidateName={candidateName} />
    </div>
  )
}
