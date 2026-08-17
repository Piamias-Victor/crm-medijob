'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { useInterviewStartMutation } from '@/lib/hooks/use-interview-start-mutation'
import { useToastStore } from '@/stores/toast-store'
import { DUPLICATE_MERGE_SUCCESS } from '@/lib/candidate-duplicate-copy'
import { useCandidateDuplicateDraft } from '@/lib/hooks/use-candidate-duplicate-draft'
import {
  toProfileInputFromDuplicateRow,
  type CandidateDuplicateRow,
} from '@/view-models/candidate-duplicate-compare'
import { buildInterviewStartFromDuplicateDraft } from '@/view-models/interview-duplicate-incoming'
import { interviewStartPath } from '@/view-models/interview-href'

const MERGE_NO_DRAFT = 'Session de fusion expirée. Relance la détection de doublon.'

export function useInterviewDuplicateReviewActions(existingId: string) {
  const router = useRouter()
  const pushToast = useToastStore((s) => s.push)
  const draft = useCandidateDuplicateDraft()
  const mergeToast = useEntityMutation({ successMessage: DUPLICATE_MERGE_SUCCESS })
  const start = useInterviewStartMutation(existingId || undefined, { redirectOnConflict: true })
  const merge = trpc.candidate.merge.useMutation({
    onSuccess: mergeToast.onSuccess,
    onError: mergeToast.onError,
  })

  async function onMerge(row: CandidateDuplicateRow) {
    if (!draft || draft.mode !== 'interview') {
      pushToast({ variant: 'error', message: MERGE_NO_DRAFT })
      return
    }
    const result = await merge.mutateAsync({
      keptId: existingId,
      data: toProfileInputFromDuplicateRow(row),
      cvUrl: row.cvUrl || draft.cvUrl || undefined,
    })
    start.submit(buildInterviewStartFromDuplicateDraft(draft, result.id))
  }

  function onIgnore() {
    if (!draft || draft.mode !== 'interview') {
      pushToast({ variant: 'error', message: MERGE_NO_DRAFT })
      return
    }
    start.submit(buildInterviewStartFromDuplicateDraft(draft))
  }

  function onCancel() {
    router.push(draft?.returnPath ?? interviewStartPath())
  }

  return { draft, onMerge, onIgnore, onCancel }
}
