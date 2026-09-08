'use client'

import { DuplicateDetectionPage } from '@/components/organisms/duplicate-detection-page/duplicate-detection-page'
import { buildPharmacyDuplicateFields } from '@/lib/pharmacy-duplicate-fields'
import { useEnterprisePharmacyMerge } from '@/lib/hooks/use-enterprise-pharmacy-merge'
import { trpc } from '@/lib/trpc/client'
import { toPharmacyDuplicateRowFromFormSource } from '@/view-models/pharmacy-duplicate-compare'
import { PHARMACY_DUPLICATE_REVIEW_LOADING } from '@/lib/pharmacy-duplicate-copy'
import type { BadakanEnterprisePreview } from '@/view-models/badakan-enterprise-preview'

export function EnterprisePharmacyMerge({ preview }: { preview: BadakanEnterprisePreview }) {
  const { onMerge, onCancel } = useEnterprisePharmacyMerge(preview)
  const query = trpc.pharmacy.getById.useQuery(
    { id: preview.existingPharmacyId ?? '' },
    { enabled: Boolean(preview.existingPharmacyId) },
  )
  const profile = query.data
  if (!preview.existingPharmacyId || !profile) {
    return <p className="text-sm text-fg-muted">{PHARMACY_DUPLICATE_REVIEW_LOADING}</p>
  }
  return (
    <DuplicateDetectionPage
      left={toPharmacyDuplicateRowFromFormSource(profile.formSource)}
      right={preview.incomingPharmacy}
      leftTitle="Pharmacie CRM"
      rightTitle="Import Badakan"
      fields={buildPharmacyDuplicateFields()}
      showIgnore={false}
      onMerge={onMerge}
      onCancel={onCancel}
    />
  )
}
