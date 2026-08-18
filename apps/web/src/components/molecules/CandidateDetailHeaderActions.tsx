'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { CandidateGdprEraseButton } from '@/components/molecules/CandidateGdprEraseButton'
import { accentButtonClassName } from '@/lib/button-styles'
import { INTERVIEW_CTA } from '@/view-models/interview-copy'
import { interviewStartPath } from '@/view-models/interview-href'

type Props = { candidateId: string; candidateName: string }

export function CandidateDetailHeaderActions({ candidateId, candidateName }: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Link href={interviewStartPath(candidateId)} className={accentButtonClassName}>
        <Plus className="size-4" />
        {INTERVIEW_CTA}
      </Link>
      <CandidateGdprEraseButton candidateId={candidateId} candidateName={candidateName} />
    </div>
  )
}
