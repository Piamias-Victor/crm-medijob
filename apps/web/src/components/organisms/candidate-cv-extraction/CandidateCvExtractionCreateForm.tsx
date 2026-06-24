'use client'

import {
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
  useForm,
  useWatch,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { CandidateCvExtractionActions } from '@/components/molecules/CandidateCvExtractionActions'
import { CandidateCvReviewFields } from '@/components/molecules/CandidateCvReviewFields'
import { CandidateCvReviewHeader } from '@/components/molecules/CandidateCvReviewHeader'
import { CandidateCvReviewLayout } from '@/components/molecules/CandidateCvReviewLayout'
import { CandidateNotesField } from '@/components/molecules/CandidateNotesField'
import { FormSection } from '@/components/molecules/FormSection'
import { CandidateDuplicateAlertModal } from '@/components/molecules/candidate-duplicate-alert/CandidateDuplicateAlertModal'
import type { CreateProps } from '@/components/organisms/candidate-cv-extraction/candidate-cv-extraction-form.types'
import { useCvExtractionJobTitles } from '@/lib/hooks/use-cv-extraction-job-titles'
import { useCvCreateDuplicateFlow } from '@/lib/hooks/use-cv-create-duplicate-flow'
import {
  candidateCreateInputSchema,
  type CandidateCreateInput,
  type CandidateProfileInput,
} from '@/view-models/candidate-profile.schema'

export function CandidateCvExtractionCreateForm(props: CreateProps) {
  const [jobTitles, setJobTitles] = useCvExtractionJobTitles(
    props.referentials.jobTitles,
    props.suggestedJobTitles,
  )
  const form = useForm<CandidateCreateInput>({
    resolver: zodResolver(candidateCreateInputSchema),
    defaultValues: props.defaultValues,
  })
  const [firstName, lastName, email, phone] = useWatch({
    control: form.control,
    name: ['firstName', 'lastName', 'email', 'phone'],
  })
  const cvDuplicate = useCvCreateDuplicateFlow(
    form,
    {
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      email,
      phone,
    },
    { cvUrl: props.cvUrl, enabled: true },
  )

  const handleCreateJobTitle = async (name: string) => {
    const created = await props.onCreateJobTitle(name)
    setJobTitles((prev) => [...prev, { id: created.value, name: created.label }])
    return created
  }

  const profileRegister = form.register as UseFormRegister<CandidateProfileInput>
  const profileSetValue = form.setValue as UseFormSetValue<CandidateProfileInput>
  const profileGetValues = form.getValues as UseFormGetValues<CandidateProfileInput>
  const profileWatch = form.watch as UseFormWatch<CandidateProfileInput>

  return (
    <CandidateCvReviewLayout
      previewUrl={props.previewUrl}
      mimeType={props.previewMimeType}
      filename={props.previewFilename}
    >
      <CandidateDuplicateAlertModal {...cvDuplicate.mergeAlertProps} />
      <form
        onSubmit={form.handleSubmit(cvDuplicate.guardSubmit(props.onSubmit))}
        className="flex flex-col gap-6 rounded-xl border border-accent/30 bg-accent/5 p-4 sm:p-5"
        noValidate
      >
        {props.errorMessage ? <FormErrorBanner message={props.errorMessage} /> : null}
        <CandidateCvReviewHeader extraction={props.extraction} />
        <CandidateCvReviewFields
          register={profileRegister}
          errors={form.formState.errors}
          setValue={profileSetValue}
          getValues={profileGetValues}
          watch={profileWatch}
          jobTitles={jobTitles}
          referentials={props.referentials}
          hideNotes
          contractOptionList={props.contractOptionList}
          onCreateJobTitle={handleCreateJobTitle}
        />
        <FormSection title="Notes internes">
          <CandidateNotesField register={profileRegister} />
        </FormSection>
        <CandidateCvExtractionActions isCreate submitting={props.submitting} />
      </form>
    </CandidateCvReviewLayout>
  )
}
