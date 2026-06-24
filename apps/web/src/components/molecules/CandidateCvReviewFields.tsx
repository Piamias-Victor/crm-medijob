'use client'

import type {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { CandidateProfileFields } from '@/components/molecules/CandidateProfileFields'
import { CandidateProfileSelects } from '@/components/molecules/CandidateProfileSelects'
import { FormSection } from '@/components/molecules/FormSection'
import type { ComboboxOption } from '@/components/molecules/Combobox'
import { contractOptions } from '@/lib/contract-options'
import { toSelectOptions } from '@/lib/form-options'
import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'
import type { RefItem } from '@/view-models/referential'

type Props = {
  register: UseFormRegister<CandidateProfileInput>
  errors: FieldErrors<CandidateProfileInput>
  setValue: UseFormSetValue<CandidateProfileInput>
  getValues: UseFormGetValues<CandidateProfileInput>
  watch: UseFormWatch<CandidateProfileInput>
  jobTitles: RefItem[]
  referentials: { softwares: RefItem[]; recruiters: RefItem[] }
  onCreateJobTitle: (name: string) => Promise<{ value: string; label: string }>
  contractOptionList?: ComboboxOption[]
  hideNotes?: boolean
}

export function CandidateCvReviewFields({
  register,
  errors,
  setValue,
  getValues,
  watch,
  jobTitles,
  referentials,
  onCreateJobTitle,
  contractOptionList,
  hideNotes,
}: Props) {
  return (
    <>
      <FormSection title="Coordonnées & mobilité">
        <CandidateProfileFields
          register={register}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
          availableFrom={watch('availableFrom')}
          onAvailableFrom={(v) => setValue('availableFrom', v)}
          hideNotes={hideNotes}
        />
      </FormSection>
      <FormSection title="Référentiels & préférences">
        <CandidateProfileSelects
          jobTitleId={watch('jobTitleId')}
          onJobTitle={(v) => setValue('jobTitleId', v)}
          jobTitles={toSelectOptions(jobTitles)}
          onCreateJobTitle={onCreateJobTitle}
          softwareIds={watch('softwareIds') ?? []}
          onSoftwareIds={(v) => setValue('softwareIds', v)}
          softwares={toSelectOptions(referentials.softwares)}
          contractTypes={watch('contractTypes') ?? []}
          onContractTypes={(v) =>
            setValue('contractTypes', v as CandidateProfileInput['contractTypes'])
          }
          contractOptionList={contractOptionList ?? contractOptions}
          referentId={watch('referentId')}
          onReferent={(v) => setValue('referentId', v)}
          recruiters={toSelectOptions(referentials.recruiters)}
        />
      </FormSection>
    </>
  )
}
