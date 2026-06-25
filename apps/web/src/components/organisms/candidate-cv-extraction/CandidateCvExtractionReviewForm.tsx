'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { CandidateCvExtractionActions } from '@/components/molecules/CandidateCvExtractionActions'
import { CandidateCvReviewFields } from '@/components/molecules/CandidateCvReviewFields'
import { CandidateCvReviewHeader } from '@/components/molecules/CandidateCvReviewHeader'
import { CandidateCvReviewLayout } from '@/components/molecules/CandidateCvReviewLayout'
import type { ReviewProps } from '@/components/organisms/candidate-cv-extraction/candidate-cv-extraction-form.types'
import { useCvExtractionJobTitles } from '@/lib/hooks/use-cv-extraction-job-titles'
import { candidateProfileInputSchema, type CandidateProfileInput } from '@/view-models/candidate-profile.schema'

export function CandidateCvExtractionReviewForm(props: ReviewProps) {
  const [jobTitles, setJobTitles] = useCvExtractionJobTitles(
    props.referentials.jobTitles,
    props.suggestedJobTitles,
  )
  const form = useForm<CandidateProfileInput>({
    resolver: zodResolver(candidateProfileInputSchema),
    defaultValues: props.defaultValues,
  })

  const handleCreateJobTitle = async (name: string) => {
    const created = await props.onCreateJobTitle(name)
    setJobTitles((prev) => [...prev, { id: created.value, name: created.label }])
    return created
  }

  return (
    <CandidateCvReviewLayout
      previewUrl={props.previewUrl}
      mimeType={props.previewMimeType}
      filename={props.previewFilename}
    >
      <form
        onSubmit={form.handleSubmit(props.onSubmit)}
        className="flex flex-col gap-6 rounded-xl border border-accent/30 bg-accent/5 p-4 sm:p-5"
        noValidate
      >
        {props.errorMessage ? <FormErrorBanner message={props.errorMessage} /> : null}
        <CandidateCvReviewHeader extraction={props.extraction} />
        <CandidateCvReviewFields
          register={form.register}
          errors={form.formState.errors}
          setValue={form.setValue}
          getValues={form.getValues}
          watch={form.watch}
          jobTitles={jobTitles}
          referentials={props.referentials}
          onCreateJobTitle={handleCreateJobTitle}
        />
        <CandidateCvExtractionActions isCreate={false} submitting={props.submitting} onCancel={props.onCancel} />
      </form>
    </CandidateCvReviewLayout>
  )
}
