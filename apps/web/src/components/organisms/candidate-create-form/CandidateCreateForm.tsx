'use client'

import { useState } from 'react'
import {
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form'
import { Button } from '@/components/atoms/Button'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { CandidateNotesField } from '@/components/molecules/CandidateNotesField'
import { CandidateProfileFields } from '@/components/molecules/CandidateProfileFields'
import { CandidateProfileSelects } from '@/components/molecules/CandidateProfileSelects'
import { FormSection } from '@/components/molecules/FormSection'
import { useCandidateCreateForm } from '@/lib/hooks/use-candidate-create-form'
import { useCandidateCreateMutations } from '@/lib/hooks/use-candidate-create-mutations'
import { createContractOptions } from '@/lib/contract-options'
import { toSelectOptions } from '@/lib/form-options'
import type {
  CandidateCreateInput,
  CandidateProfileInput,
} from '@/view-models/candidate-profile.schema'
import type { CandidateFormReferentials } from '@/view-models/referential'

type Props = {
  defaultValues: CandidateCreateInput
  referentials: CandidateFormReferentials
}

export function CandidateCreateForm({ defaultValues, referentials }: Props) {
  const { create, createJobTitle } = useCandidateCreateMutations()
  const [jobTitles, setJobTitles] = useState(referentials.jobTitles)
  const { register, handleSubmit, setValue, watch, getValues, formState } =
    useCandidateCreateForm(defaultValues)

  const onCreateJobTitle = async (name: string) => {
    const created = await createJobTitle.mutateAsync({ name })
    setJobTitles((prev) => [...prev, created])
    return { value: created.id, label: created.name }
  }

  return (
    <form onSubmit={handleSubmit((data) => create.mutate(data))} className="flex flex-col gap-8" noValidate>
      {create.error ? <FormErrorBanner message={create.error.message} /> : null}
      <FormSection title="Coordonnées & mobilité">
        <CandidateProfileFields
          register={register as UseFormRegister<CandidateProfileInput>}
          errors={formState.errors}
          setValue={setValue as UseFormSetValue<CandidateProfileInput>}
          getValues={getValues as UseFormGetValues<CandidateProfileInput>}
          availableFrom={watch('availableFrom')}
          onAvailableFrom={(value) => setValue('availableFrom', value)}
          hideNotes
        />
      </FormSection>
      <FormSection title="Référentiels & préférences">
        <CandidateProfileSelects
          jobTitleId={watch('jobTitleId')}
          onJobTitle={(value) => setValue('jobTitleId', value)}
          jobTitles={toSelectOptions(jobTitles)}
          onCreateJobTitle={onCreateJobTitle}
          softwareIds={watch('softwareIds') ?? []}
          onSoftwareIds={(value) => setValue('softwareIds', value)}
          softwares={toSelectOptions(referentials.softwares)}
          contractTypes={watch('contractTypes') ?? []}
          onContractTypes={(value) =>
            setValue('contractTypes', value as CandidateCreateInput['contractTypes'])
          }
          contractOptionList={createContractOptions}
          referentId={watch('referentId')}
          onReferent={(value) => setValue('referentId', value)}
          recruiters={toSelectOptions(referentials.recruiters)}
        />
      </FormSection>
      <FormSection title="Notes internes">
        <CandidateNotesField register={register as UseFormRegister<CandidateProfileInput>} />
      </FormSection>
      <div className="flex justify-end border-t border-border/60 pt-4">
        <Button type="submit" variant="accent" disabled={create.isPending} className="shadow-md shadow-accent/20">
          {create.isPending ? 'Création…' : 'Créer le candidat'}
        </Button>
      </div>
    </form>
  )
}
