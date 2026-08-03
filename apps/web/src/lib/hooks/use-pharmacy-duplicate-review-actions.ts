'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import {
  PHARMACY_DUPLICATE_CREATE_SUCCESS,
  PHARMACY_DUPLICATE_MERGE_SUCCESS,
} from '@/lib/pharmacy-duplicate-copy'
import { clearPharmacyDuplicateDraft } from '@/lib/pharmacy-duplicate-draft-storage'
import { clearPharmacyImportQueue } from '@/lib/pharmacy-import-queue-storage'
import { usePharmacyDuplicateDraft } from '@/lib/hooks/use-pharmacy-duplicate-draft'
import { openNextPharmacyImportDuplicate } from '@/lib/pharmacy-import-navigation'
import {
  toPharmacyInputFromDuplicateRow,
  type PharmacyDuplicateRow,
} from '@/view-models/pharmacy-duplicate-compare'

function finishAndNavigate(router: ReturnType<typeof useRouter>, fallbackId?: string) {
  clearPharmacyDuplicateDraft()
  const next = openNextPharmacyImportDuplicate()
  if (next) {
    router.push(next)
    return
  }
  router.push(fallbackId ? `/pharmacies/${fallbackId}` : '/pharmacies')
}

export function usePharmacyDuplicateReviewActions(existingId: string) {
  const router = useRouter()
  const draft = usePharmacyDuplicateDraft()
  const mergeToast = useEntityMutation({ successMessage: PHARMACY_DUPLICATE_MERGE_SUCCESS })
  const createToast = useEntityMutation({ successMessage: PHARMACY_DUPLICATE_CREATE_SUCCESS })
  const merge = trpc.pharmacy.merge.useMutation({
    onSuccess: (result) => {
      mergeToast.onSuccess()
      finishAndNavigate(router, result.id)
    },
    onError: mergeToast.onError,
  })
  const create = trpc.pharmacy.create.useMutation({
    onSuccess: (result) => {
      createToast.onSuccess()
      finishAndNavigate(router, result.id)
    },
    onError: createToast.onError,
  })

  async function onMerge(row: PharmacyDuplicateRow) {
    if (!draft) return
    await merge.mutateAsync({
      keptId: existingId,
      data: toPharmacyInputFromDuplicateRow(row),
    })
  }

  async function onIgnore() {
    if (!draft) return
    await create.mutateAsync(draft.incoming)
  }

  function onCancel() {
    clearPharmacyDuplicateDraft()
    clearPharmacyImportQueue()
    router.push(draft?.returnPath ?? '/pharmacies')
  }

  return { draft, onMerge, onIgnore, onCancel }
}
