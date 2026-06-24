'use client'

import type { UseFormReturn } from 'react-hook-form'
import { CandidateProfileFields } from '@/components/molecules/CandidateProfileFields'
import { CandidateProfileSelects } from '@/components/molecules/CandidateProfileSelects'
import { FormSection } from '@/components/molecules/FormSection'
import type { ComboboxOption } from '@/components/molecules/Combobox'
import { contractOptions } from '@/lib/contract-options'
import { toSelectOptions } from '@/lib/form-options'
import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'
import type { RefItem } from '@/view-models/referential'

type Props = {
  form: UseFormReturn<CandidateProfileInput>
  jobTitles: RefItem[]
  referentials: { softwares: RefItem[]; recruiters: RefItem[] }
  onCreateJobTitle: (name: string) => Promise<{ value: string; label: string }>
  contractOptionList?: ComboboxOption[]
  hideNotes?: boolean
}

export function CandidateCvReviewFields({
  form,
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
          register={form.register}
          errors={form.formState.errors}
          setValue={form.setValue}
          getValues={form.getValues}
          availableFrom={form.watch('availableFrom')}
          onAvailableFrom={(v) => form.setValue('availableFrom', v)}
          hideNotes={hideNotes}
        />
      </FormSection>
      <FormSection title="Référentiels & préférences">
        <CandidateProfileSelects
          jobTitleId={form.watch('jobTitleId')}
          onJobTitle={(v) => form.setValue('jobTitleId', v)}
          jobTitles={toSelectOptions(jobTitles)}
          onCreateJobTitle={onCreateJobTitle}
          softwareIds={form.watch('softwareIds') ?? []}
          onSoftwareIds={(v) => form.setValue('softwareIds', v)}
          softwares={toSelectOptions(referentials.softwares)}
          contractTypes={form.watch('contractTypes') ?? []}
          onContractTypes={(v) =>
            form.setValue('contractTypes', v as CandidateProfileInput['contractTypes'])
          }
          contractOptionList={contractOptionList ?? contractOptions}
          referentId={form.watch('referentId')}
          onReferent={(v) => form.setValue('referentId', v)}
          recruiters={toSelectOptions(referentials.recruiters)}
        />
      </FormSection>
    </>
  )
}
