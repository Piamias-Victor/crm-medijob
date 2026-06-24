'use client'

import { type Resolver, type UseFormRegister, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { CandidateCvExtractionActions } from '@/components/molecules/CandidateCvExtractionActions'
import { CandidateCvReviewFields } from '@/components/molecules/CandidateCvReviewFields'
import { CandidateCvReviewHeader } from '@/components/molecules/CandidateCvReviewHeader'
import { CandidateCvReviewLayout } from '@/components/molecules/CandidateCvReviewLayout'
import { CandidateNotesField } from '@/components/molecules/CandidateNotesField'
import { FormSection } from '@/components/molecules/FormSection'
import type { CandidateCvExtractionFormProps } from '@/components/organisms/candidate-cv-extraction/candidate-cv-extraction-form.types'
import { useCvExtractionJobTitles } from '@/lib/hooks/use-cv-extraction-job-titles'
import {
  candidateCreateInputSchema,
  candidateProfileInputSchema,
  type CandidateCreateInput,
  type CandidateProfileInput,
} from '@/view-models/candidate-profile.schema'

export function CandidateCvExtractionForm(props: CandidateCvExtractionFormProps) {
  const isCreate = props.mode === 'create'
  const [jobTitles, setJobTitles] = useCvExtractionJobTitles(
    props.referentials.jobTitles,
    props.suggestedJobTitles,
  )
  const form = useForm<CandidateCreateInput | CandidateProfileInput>({
    resolver: zodResolver(
      isCreate ? candidateCreateInputSchema : candidateProfileInputSchema,
    ) as Resolver<CandidateCreateInput | CandidateProfileInput>,
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
        onSubmit={form.handleSubmit((data) => props.onSubmit(data as never))}
        className="flex flex-col gap-6 rounded-xl border border-accent/30 bg-accent/5 p-4 sm:p-5"
        noValidate
      >
        {props.errorMessage ? <FormErrorBanner message={props.errorMessage} /> : null}
        <CandidateCvReviewHeader extraction={props.extraction} />
        <CandidateCvReviewFields
          form={form as never}
          jobTitles={jobTitles}
          referentials={props.referentials}
          hideNotes={isCreate}
          contractOptionList={isCreate ? props.contractOptionList : undefined}
          onCreateJobTitle={handleCreateJobTitle}
        />
        {isCreate ? (
          <FormSection title="Notes internes">
            <CandidateNotesField register={form.register as UseFormRegister<CandidateProfileInput>} />
          </FormSection>
        ) : null}
        <CandidateCvExtractionActions
          isCreate={isCreate}
          submitting={props.submitting}
          onCancel={!isCreate ? props.onCancel : undefined}
        />
      </form>
    </CandidateCvReviewLayout>
  )
}
