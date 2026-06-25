'use client'

import type { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { CandidateNotesField } from '@/components/molecules/CandidateNotesField'
import { CandidateProfileFields } from '@/components/molecules/CandidateProfileFields'
import { CandidateProfileSelects } from '@/components/molecules/CandidateProfileSelects'
import { FormSection } from '@/components/molecules/FormSection'
import { createContractOptions } from '@/lib/contract-options'
import { toSelectOptions } from '@/lib/form-options'
import type { CandidateCreateInput, CandidateProfileInput } from '@/view-models/candidate-profile.schema'
import type { RefItem } from '@/view-models/referential'

type Props = {
  register: UseFormRegister<CandidateCreateInput>
  errors: Record<string, { message?: string } | undefined>
  setValue: UseFormSetValue<CandidateCreateInput>
  getValues: UseFormGetValues<CandidateCreateInput>
  watch: (name: keyof CandidateCreateInput) => unknown
  jobTitles: RefItem[]
  referentials: { softwares: RefItem[]; recruiters: RefItem[] }
  onCreateJobTitle: (name: string) => Promise<{ value: string; label: string }>
}

export function CandidateCreateFormSections(props: Props) {
  const profileRegister = props.register as UseFormRegister<CandidateProfileInput>
  return (
    <>
      <FormSection title="Coordonnées & mobilité">
        <CandidateProfileFields
          register={profileRegister}
          errors={props.errors}
          setValue={props.setValue as UseFormSetValue<CandidateProfileInput>}
          getValues={props.getValues as UseFormGetValues<CandidateProfileInput>}
          availableFrom={props.watch('availableFrom') as string | undefined}
          onAvailableFrom={(value) => props.setValue('availableFrom', value)}
          hideNotes
        />
      </FormSection>
      <FormSection title="Référentiels & préférences">
        <CandidateProfileSelects
          jobTitleId={props.watch('jobTitleId') as string}
          onJobTitle={(value) => props.setValue('jobTitleId', value)}
          jobTitles={toSelectOptions(props.jobTitles)}
          onCreateJobTitle={props.onCreateJobTitle}
          softwareIds={(props.watch('softwareIds') as string[]) ?? []}
          onSoftwareIds={(value) => props.setValue('softwareIds', value)}
          softwares={toSelectOptions(props.referentials.softwares)}
          contractTypes={(props.watch('contractTypes') as CandidateCreateInput['contractTypes']) ?? []}
          onContractTypes={(value) =>
            props.setValue('contractTypes', value as CandidateCreateInput['contractTypes'])
          }
          contractOptionList={createContractOptions}
          referentId={props.watch('referentId') as string}
          onReferent={(value) => props.setValue('referentId', value)}
          recruiters={toSelectOptions(props.referentials.recruiters)}
        />
      </FormSection>
      <FormSection title="Notes internes">
        <CandidateNotesField register={profileRegister} />
      </FormSection>
    </>
  )
}
