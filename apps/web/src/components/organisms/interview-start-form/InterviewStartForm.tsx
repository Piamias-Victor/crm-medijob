'use client'

import Link from 'next/link'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { CandidateDuplicateAlertModal } from '@/components/molecules/candidate-duplicate-alert/CandidateDuplicateAlertModal'
import { InterviewStartFields } from '@/components/molecules/InterviewStartFields'
import { useInterviewDuplicateMergeFlow } from '@/lib/hooks/use-interview-duplicate-merge-flow'
import {
  interviewStartSchema,
  type InterviewStartInput,
} from '@/view-models/interview-start.schema'
import { interviewDuplicateProbeEnabled } from '@/view-models/interview-duplicate-incoming'
import { INTERVIEW_RESUME_DRAFT, INTERVIEW_START_PENDING, INTERVIEW_START_SUBMIT } from '@/view-models/interview-copy'

type JobTitle = { id: string; name: string }

type Props = {
  defaultValues: InterviewStartInput
  jobTitles: JobTitle[]
  submitting: boolean
  errorMessage?: string | null
  resumeHref?: string | null
  onSubmit: (data: InterviewStartInput) => void
}

export function InterviewStartForm({
  defaultValues,
  jobTitles,
  submitting,
  errorMessage,
  resumeHref,
  onSubmit,
}: Props) {
  const form = useForm<InterviewStartInput>({
    resolver: zodResolver(interviewStartSchema),
    defaultValues,
  })
  const [firstName, lastName, email, phone] = useWatch({
    control: form.control,
    name: ['firstName', 'lastName', 'email', 'phone'],
  })
  const duplicateFlow = useInterviewDuplicateMergeFlow(
    form,
    { firstName: firstName ?? '', lastName: lastName ?? '', email, phone },
    interviewDuplicateProbeEnabled(defaultValues.candidateId),
  )

  return (
    <>
      <CandidateDuplicateAlertModal {...duplicateFlow.mergeAlertProps} />
      <form
        onSubmit={form.handleSubmit(duplicateFlow.guardSubmit(onSubmit))}
        className="flex flex-col gap-8"
        noValidate
      >
        {defaultValues.candidateId ? (
          <input type="hidden" {...form.register('candidateId')} />
        ) : null}
        {errorMessage ? <FormErrorBanner message={errorMessage} /> : null}
        {resumeHref ? (
          <Link href={resumeHref} className="text-sm font-medium text-accent-hover">
            {INTERVIEW_RESUME_DRAFT}
          </Link>
        ) : null}
        <InterviewStartFields
          register={form.register}
          setValue={form.setValue}
          watch={form.watch}
          errors={form.formState.errors}
          jobTitles={jobTitles}
        />
        <div className="flex justify-end border-t border-border/60 pt-4">
          <Button type="submit" variant="accent" disabled={submitting}>
            {submitting ? INTERVIEW_START_PENDING : INTERVIEW_START_SUBMIT}
          </Button>
        </div>
      </form>
    </>
  )
}
