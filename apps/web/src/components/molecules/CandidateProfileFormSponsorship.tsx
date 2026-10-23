'use client'

import { FormSection } from '@/components/molecules/FormSection'
import { CandidateSponsorshipSection } from '@/components/molecules/CandidateSponsorshipSection'

export function CandidateProfileFormSponsorship({ candidateId }: { candidateId: string }) {
  return (
    <FormSection title="Parrainage">
      <CandidateSponsorshipSection candidateId={candidateId} />
    </FormSection>
  )
}
