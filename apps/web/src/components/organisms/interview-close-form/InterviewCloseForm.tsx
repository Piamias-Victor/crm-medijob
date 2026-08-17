'use client'

import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { InterviewScoreGrid } from '@/components/molecules/InterviewScoreGrid'
import { InterviewDecisionSelect } from '@/components/molecules/InterviewDecisionSelect'
import { InterviewMappingDiffs } from '@/components/molecules/InterviewMappingDiffs'
import { InterviewCloseStatus } from '@/components/molecules/InterviewCloseStatus'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import {
  interviewCloseSchema,
  type InterviewCloseInput,
} from '@/view-models/interview-close.schema'
import {
  INTERVIEW_CLOSE_CONFIRM,
  INTERVIEW_CLOSE_HINT,
  INTERVIEW_CLOSE_SUCCESS,
} from '@/view-models/interview-copy'
import { interviewCandidateFichePath } from '@/view-models/interview-href'
import { proposeCandidateStatus } from '@/view-models/interview-propose-status'
import type { InterviewClosePreview } from '@/server/interview/preview-close'

type Props = { preview: InterviewClosePreview; interviewId: string }

export function InterviewCloseForm({ preview, interviewId }: Props) {
  const router = useRouter()
  const mutation = useEntityMutation({ successMessage: INTERVIEW_CLOSE_SUCCESS })
  const form = useForm<InterviewCloseInput>({
    resolver: zodResolver(interviewCloseSchema),
    defaultValues: {
      id: interviewId,
      scores: preview.scores,
      decision: preview.decision,
      overwriteFields: [],
      applyStatus: false,
      blacklist: false,
    },
  })
  const scores = useWatch({ control: form.control, name: 'scores' }) ?? {}
  const overwriteFields = useWatch({ control: form.control, name: 'overwriteFields' }) ?? []
  const decision = useWatch({ control: form.control, name: 'decision' }) ?? preview.decision
  const blacklist = useWatch({ control: form.control, name: 'blacklist' }) ?? false
  const proposedStatus = proposeCandidateStatus(decision, preview.currentStatus, blacklist)
  const close = trpc.interview.close.useMutation({
    onSuccess: () => {
      mutation.onSuccess()
      router.push(interviewCandidateFichePath(preview.candidateId))
    },
    onError: mutation.onError,
  })

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit((values) => close.mutate(values))}
    >
      <p className="text-sm text-fg-muted">{INTERVIEW_CLOSE_HINT}</p>
      <InterviewScoreGrid
        scores={scores}
        onChange={(id, value) => form.setValue(`scores.${id}`, value)}
      />
      <InterviewDecisionSelect
        value={decision}
        onChange={(value) => form.setValue('decision', value)}
      />
      <InterviewMappingDiffs
        diffs={preview.diffs}
        overwriteFields={overwriteFields}
        onToggleOverwrite={(field, checked) => {
          const next = checked ? [...overwriteFields, field] : overwriteFields.filter((id) => id !== field)
          form.setValue('overwriteFields', next)
        }}
      />
      <InterviewCloseStatus
        proposedStatus={proposedStatus}
        applyStatus={form.watch('applyStatus')}
        blacklist={blacklist}
        showBlacklist={decision === 'NON_ELIGIBLE'}
        onApplyStatus={(value) => form.setValue('applyStatus', value)}
        onBlacklist={(value) => form.setValue('blacklist', value)}
      />
      <Button type="submit" variant="accent" disabled={close.isPending}>
        {INTERVIEW_CLOSE_CONFIRM}
      </Button>
    </form>
  )
}
