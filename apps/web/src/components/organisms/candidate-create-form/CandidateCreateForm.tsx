'use client'

import { useState } from 'react'
import { useWatch } from 'react-hook-form'
import { Button } from '@/components/atoms/Button'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { CandidateCreateFormSections } from '@/components/organisms/candidate-create-form/CandidateCreateFormSections'
import { CandidateDuplicateAlertModal } from '@/components/molecules/candidate-duplicate-alert/CandidateDuplicateAlertModal'
import { useCandidateCreateForm } from '@/lib/hooks/use-candidate-create-form'
import { useCandidateCreateMutations } from '@/lib/hooks/use-candidate-create-mutations'
import { useCandidateDuplicateMergeFlow } from '@/lib/hooks/use-candidate-duplicate-merge-flow'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { CandidateFormReferentials } from '@/view-models/referential'

type Props = {
  defaultValues: CandidateCreateInput
  referentials: CandidateFormReferentials
}

export function CandidateCreateForm({ defaultValues, referentials }: Props) {
  const { create, createJobTitle } = useCandidateCreateMutations()
  const [jobTitles, setJobTitles] = useState(referentials.jobTitles)
  const form = useCandidateCreateForm(defaultValues)
  const { register, handleSubmit, setValue, watch, getValues, formState, control } = form
  const [firstName, lastName, email, phone] = useWatch({
    control,
    name: ['firstName', 'lastName', 'email', 'phone'],
  })
  const duplicateFlow = useCandidateDuplicateMergeFlow(
    form,
    {
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      email,
      phone,
    },
    { mode: 'create', returnPath: '/candidats/new' },
  )

  return (
    <>
      <CandidateDuplicateAlertModal {...duplicateFlow.mergeAlertProps} />
      <form
        onSubmit={handleSubmit(duplicateFlow.guardSubmit((data) => create.mutate(data)))}
        className="flex flex-col gap-8"
        noValidate
      >
        {create.error ? <FormErrorBanner message={create.error.message} /> : null}
        <CandidateCreateFormSections
          register={register}
          errors={formState.errors}
          setValue={setValue}
          getValues={getValues}
          watch={watch}
          jobTitles={jobTitles}
          referentials={referentials}
          onCreateJobTitle={async (name) => {
            const created = await createJobTitle.mutateAsync({ name })
            setJobTitles((prev) => [...prev, created])
            return { value: created.id, label: created.name }
          }}
        />
        <div className="flex justify-end border-t border-border/60 pt-4">
          <Button type="submit" variant="accent" disabled={create.isPending} className="shadow-md shadow-accent/20">
            {create.isPending ? 'Création…' : 'Créer le candidat'}
          </Button>
        </div>
      </form>
    </>
  )
}
