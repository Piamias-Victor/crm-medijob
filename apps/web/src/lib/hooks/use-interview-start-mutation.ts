'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { INTERVIEW_START_SUCCESS } from '@/view-models/interview-copy'
import { interviewDraftPath } from '@/view-models/interview-href'
import type { InterviewStartInput } from '@/view-models/interview-start.schema'

export function useInterviewStartMutation(candidateId?: string) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const mutation = useEntityMutation({ successMessage: INTERVIEW_START_SUCCESS })
  const [resumeHref, setResumeHref] = useState<string | null>(null)

  const start = trpc.interview.start.useMutation({
    onSuccess: (result) => {
      mutation.onSuccess()
      router.push(interviewDraftPath(result.candidateId, result.interviewId))
    },
    onError: (error) => {
      mutation.onError(error)
      if (error.data?.code !== 'CONFLICT' || !candidateId) return
      void utils.interview.listByCandidate.fetch({ candidateId }).then((rows) => {
        const draft = rows.find((row) => row.status === 'DRAFT')
        if (draft) setResumeHref(interviewDraftPath(candidateId, draft.id))
      })
    },
  })

  return {
    submit: (data: InterviewStartInput) => start.mutate(data),
    submitting: start.isPending,
    errorMessage: start.error?.message ?? null,
    resumeHref,
  }
}
