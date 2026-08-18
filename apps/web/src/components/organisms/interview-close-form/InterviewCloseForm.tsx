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
  applyStatusFor,
  interviewCloseDefaults,
  interviewCloseSchema,
} from '@/view-models/interview-close-defaults'
import type { InterviewCloseInput } from '@/view-models/interview-close.schema'
import { INTERVIEW_CLOSE_CONFIRM, INTERVIEW_CLOSE_SUCCESS } from '@/view-models/interview-copy'
import { interviewCandidateFichePath } from '@/view-models/interview-href'
import type { InterviewClosePreview } from '@/server/interview/preview-close'

type Props = { preview: InterviewClosePreview; interviewId: string }

export function InterviewCloseForm({ preview, interviewId }: Props) {
  const router = useRouter()
  const mutation = useEntityMutation({ successMessage: INTERVIEW_CLOSE_SUCCESS })
  const form = useForm<InterviewCloseInput>({
    resolver: zodResolver(interviewCloseSchema),
    defaultValues: interviewCloseDefaults(preview, interviewId),
  })
  const scores = useWatch({ control: form.control, name: 'scores' }) ?? {}
  const savedFields = useWatch({ control: form.control, name: 'overwriteFields' }) ?? []
  const mappingEdits = useWatch({ control: form.control, name: 'mappingEdits' }) ?? {}
  const decision = useWatch({ control: form.control, name: 'decision' }) ?? preview.decision
  const blacklist = useWatch({ control: form.control, name: 'blacklist' }) ?? false
  const close = trpc.interview.close.useMutation({
    onSuccess: () => {
      mutation.onSuccess()
      router.push(interviewCandidateFichePath(preview.candidateId))
    },
    onError: mutation.onError,
  })
  const syncStatus = (nextDecision: InterviewCloseInput['decision'], nextBlacklist: boolean) => {
    form.setValue('applyStatus', applyStatusFor(preview, nextDecision, nextBlacklist))
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={form.handleSubmit((values) => close.mutate(values))}>
      <InterviewScoreGrid
        scores={scores}
        maxes={preview.scoreMax}
        onChange={(id, value) => form.setValue(`scores.${id}`, value)}
      />
      <InterviewDecisionSelect
        value={decision}
        onChange={(value) => {
          form.setValue('decision', value)
          syncStatus(value, blacklist)
        }}
      />
      <InterviewMappingDiffs
        diffs={preview.diffs}
        values={mappingEdits}
        savedFields={savedFields}
        onEdit={(field, value) => form.setValue(`mappingEdits.${field}`, value)}
        onToggleSave={(field, saved) => {
          const next = saved ? [...savedFields, field] : savedFields.filter((id) => id !== field)
          form.setValue('overwriteFields', next)
        }}
      />
      <InterviewCloseStatus
        blacklist={blacklist}
        showBlacklist={decision === 'NON_ELIGIBLE'}
        onBlacklist={(value) => {
          form.setValue('blacklist', value)
          syncStatus(decision, value)
        }}
      />
      <Button type="submit" variant="accent" className="self-end shadow-md shadow-accent/20" disabled={close.isPending}>
        {INTERVIEW_CLOSE_CONFIRM}
      </Button>
    </form>
  )
}
