'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { INTERVIEW_ABANDON, INTERVIEW_ABANDON_PENDING, INTERVIEW_ABANDON_SUCCESS, INTERVIEW_DRAFT_HINT } from '@/view-models/interview-copy'
import type { InterviewListRow } from '@/view-models/interview-list'

type Props = { candidateId: string; interview: InterviewListRow }

export function InterviewDraftPanel({ candidateId, interview }: Props) {
  const router = useRouter()
  const mutation = useEntityMutation({ successMessage: INTERVIEW_ABANDON_SUCCESS })
  const abandon = trpc.interview.abandon.useMutation({
    onSuccess: () => {
      mutation.onSuccess()
      router.push(`/candidats/${candidateId}`)
    },
    onError: mutation.onError,
  })

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-fg-muted">
        {interview.modeLabel} · {interview.statusLabel} · {interview.dateLabel}
      </p>
      <p className="text-sm text-fg">{INTERVIEW_DRAFT_HINT}</p>
      {interview.status === 'DRAFT' ? (
        <div>
          <Button
            type="button"
            variant="danger"
            disabled={abandon.isPending}
            onClick={() => abandon.mutate({ id: interview.id })}
          >
            {abandon.isPending ? INTERVIEW_ABANDON_PENDING : INTERVIEW_ABANDON}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
