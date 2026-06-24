'use client'

import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CandidateDuplicateReviewClient } from '@/components/organisms/candidate-duplicate-review/CandidateDuplicateReviewClient'
import {
  DUPLICATE_REVIEW_SECTION_DESCRIPTION,
  DUPLICATE_REVIEW_SECTION_TITLE,
  DUPLICATE_REVIEW_TITLE,
} from '@/components/organisms/candidate-duplicate-review/candidate-duplicate-review-copy'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { RefItem } from '@/view-models/referential'

type Props = {
  initialExistingId?: string
  pick?: boolean
  existing?: CandidateProfilePayload | null
  referentials: { jobTitles: RefItem[]; softwares: RefItem[]; recruiters: RefItem[] }
}

export function CandidateDuplicateReviewPage(props: Props) {
  return (
    <EntityDetailShell
      header={
        <DetailPageHeader backHref="/candidats" backLabel="CVthèque" name={DUPLICATE_REVIEW_TITLE} />
      }
      tabKey="profil"
    >
      <SectionCard
        variant="glass"
        title={DUPLICATE_REVIEW_SECTION_TITLE}
        description={DUPLICATE_REVIEW_SECTION_DESCRIPTION}
        bodyClassName="p-5 sm:p-6"
      >
        <CandidateDuplicateReviewClient {...props} />
      </SectionCard>
    </EntityDetailShell>
  )
}
