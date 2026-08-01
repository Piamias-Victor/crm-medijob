'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import {
  DUPLICATE_CREATE_SUCCESS,
  DUPLICATE_MERGE_SUCCESS,
  DUPLICATE_UPDATE_SUCCESS,
} from '@/lib/candidate-duplicate-copy'
import { clearCandidateDuplicateDraft } from '@/lib/candidate-duplicate-draft-storage'
import { useCandidateDuplicateDraft } from '@/lib/hooks/use-candidate-duplicate-draft'
import {
  cancelCandidateImportReview,
  finishCandidateImportReview,
} from '@/lib/candidate-import-finish-navigation'
import {
  toProfileInputFromDuplicateRow,
  type CandidateDuplicateRow,
} from '@/view-models/candidate-duplicate-compare'

export function useCandidateDuplicateReviewActions(existingId: string) {
  const router = useRouter()
  const draft = useCandidateDuplicateDraft()
  const mergeToast = useEntityMutation({ successMessage: DUPLICATE_MERGE_SUCCESS })
  const createToast = useEntityMutation({ successMessage: DUPLICATE_CREATE_SUCCESS })
  const updateToast = useEntityMutation({ successMessage: DUPLICATE_UPDATE_SUCCESS })
  const finish = (id?: string) => {
    if (draft?.mode === 'import') {
      finishCandidateImportReview((href) => router.push(href), id)
      return
    }
    clearCandidateDuplicateDraft()
    router.push(id ? `/candidats/${id}` : '/candidats')
  }
  const merge = trpc.candidate.merge.useMutation({
    onSuccess: (result) => {
      mergeToast.onSuccess()
      finish(result.id)
    },
    onError: mergeToast.onError,
  })
  const create = trpc.candidate.create.useMutation({
    onSuccess: (result) => {
      createToast.onSuccess()
      finish(result.id)
    },
    onError: createToast.onError,
  })
  const update = trpc.candidate.update.useMutation({
    onSuccess: (_result, variables) => {
      clearCandidateDuplicateDraft()
      updateToast.onSuccess()
      router.push(`/candidats/${variables.id}`)
    },
    onError: updateToast.onError,
  })

  async function onMerge(row: CandidateDuplicateRow) {
    if (!draft) return
    await merge.mutateAsync({
      keptId: existingId,
      absorbedId: draft.mode === 'edit' ? draft.absorbedId : undefined,
      data: toProfileInputFromDuplicateRow(row),
      cvUrl: row.cvUrl || draft.cvUrl || undefined,
    })
  }

  async function onIgnore() {
    if (!draft) return
    if (draft.mode === 'edit') {
      await update.mutateAsync({ id: draft.absorbedId, data: draft.incoming })
      return
    }
    await create.mutateAsync({ ...draft.incoming, cvUrl: draft.cvUrl })
  }

  function onCancel() {
    if (draft?.mode === 'import') {
      cancelCandidateImportReview((href) => router.push(href), draft.returnPath)
      return
    }
    router.push(draft?.returnPath ?? '/candidats')
  }

  return { draft, onMerge, onIgnore, onCancel }
}
