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
  toProfileInputFromDuplicateRow,
  type CandidateDuplicateRow,
} from '@/view-models/candidate-duplicate-compare'

export function useCandidateDuplicateReviewActions(existingId: string) {
  const router = useRouter()
  const draft = useCandidateDuplicateDraft()
  const mergeToast = useEntityMutation({ successMessage: DUPLICATE_MERGE_SUCCESS })
  const createToast = useEntityMutation({ successMessage: DUPLICATE_CREATE_SUCCESS })
  const updateToast = useEntityMutation({ successMessage: DUPLICATE_UPDATE_SUCCESS })
  const merge = trpc.candidate.merge.useMutation({
    onSuccess: (result) => {
      clearCandidateDuplicateDraft()
      mergeToast.onSuccess()
      router.push(`/candidats/${result.id}`)
    },
    onError: mergeToast.onError,
  })
  const create = trpc.candidate.create.useMutation({
    onSuccess: (result) => {
      clearCandidateDuplicateDraft()
      createToast.onSuccess()
      router.push(`/candidats/${result.id}`)
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
    const data = toProfileInputFromDuplicateRow(row)
    await merge.mutateAsync({
      keptId: existingId,
      absorbedId: draft.mode === 'edit' ? draft.absorbedId : undefined,
      data,
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
    if (!draft) {
      router.push('/candidats')
      return
    }
    router.push(draft.returnPath)
  }

  return { draft, onMerge, onIgnore, onCancel }
}
