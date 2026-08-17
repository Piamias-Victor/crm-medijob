'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { InterviewSectionNav } from '@/components/molecules/InterviewSectionNav'
import { InterviewRunForm } from '@/components/organisms/interview-run-form/InterviewRunForm'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import {
  INTERVIEW_ABANDON,
  INTERVIEW_ABANDON_PENDING,
  INTERVIEW_ABANDON_SUCCESS,
  INTERVIEW_DRAFT_HINT,
} from '@/view-models/interview-copy'
import type { InterviewRun } from '@/view-models/interview-run'

type Props = { run: InterviewRun }

export function InterviewDraftPanel({ run }: Props) {
  const router = useRouter()
  const mutation = useEntityMutation({ successMessage: INTERVIEW_ABANDON_SUCCESS })
  const abandon = trpc.interview.abandon.useMutation({
    onSuccess: () => {
      mutation.onSuccess()
      router.push(`/candidats/${run.candidateId}`)
    },
    onError: mutation.onError,
  })

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-fg-muted">
        {run.templateLabel} · {run.modeLabel} · {run.statusLabel} · {run.dateLabel}
      </p>
      <p className="text-xs font-medium text-fg-muted">{INTERVIEW_DRAFT_HINT}</p>
      <InterviewSectionNav sections={run.sections} />
      <InterviewRunForm run={run} />
      {run.status === 'DRAFT' ? (
        <div>
          <Button
            type="button"
            variant="danger"
            disabled={abandon.isPending}
            onClick={() => abandon.mutate({ id: run.id })}
          >
            {abandon.isPending ? INTERVIEW_ABANDON_PENDING : INTERVIEW_ABANDON}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
