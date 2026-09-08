'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { PHARMACY_DUPLICATE_MERGE_SUCCESS } from '@/lib/pharmacy-duplicate-copy'
import { toPharmacyInputFromDuplicateRow } from '@/view-models/pharmacy-duplicate-compare'
import type { PharmacyDuplicateRow } from '@/view-models/pharmacy-duplicate-compare'
import type { BadakanEnterprisePreview } from '@/view-models/badakan-enterprise-preview'

export function useEnterprisePharmacyMerge(preview: BadakanEnterprisePreview) {
  const router = useRouter()
  const toast = useEntityMutation({
    successMessage: PHARMACY_DUPLICATE_MERGE_SUCCESS,
    onSuccess: () => router.push('/interim/officines'),
  })
  const merge = trpc.pharmacy.merge.useMutation()
  const confirm = trpc.badakanEnterprise.confirm.useMutation({
    onSuccess: toast.onSuccess,
    onError: toast.onError,
  })

  async function onMerge(row: PharmacyDuplicateRow) {
    if (!preview.existingPharmacyId) return
    await merge.mutateAsync({
      keptId: preview.existingPharmacyId,
      data: toPharmacyInputFromDuplicateRow(row),
    })
    await confirm.mutateAsync({ id: preview.id, siret: preview.siret })
  }

  function onCancel() {
    router.push('/interim/officines')
  }

  return { onMerge, onCancel }
}
