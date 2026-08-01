'use client'

import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { PharmacyDuplicateReviewClient } from '@/components/organisms/pharmacy-duplicate-review/PharmacyDuplicateReviewClient'
import {
  PHARMACY_DUPLICATE_REVIEW_TITLE,
  PHARMACY_DUPLICATE_SECTION_DESCRIPTION,
  PHARMACY_DUPLICATE_SECTION_TITLE,
} from '@/lib/pharmacy-duplicate-copy'
import type { PharmacyDetailPayload } from '@/view-models/pharmacy-detail'

type Props = {
  initialExistingId?: string
  pick?: boolean
  existing?: PharmacyDetailPayload | null
}

export function PharmacyDuplicateReviewPage(props: Props) {
  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref="/pharmacies"
          backLabel="Pharmacies"
          name={PHARMACY_DUPLICATE_REVIEW_TITLE}
        />
      }
      tabKey="profil"
    >
      <SectionCard
        variant="glass"
        title={PHARMACY_DUPLICATE_SECTION_TITLE}
        description={PHARMACY_DUPLICATE_SECTION_DESCRIPTION}
        bodyClassName="p-5 sm:p-6"
      >
        <PharmacyDuplicateReviewClient {...props} />
      </SectionCard>
    </EntityDetailShell>
  )
}
