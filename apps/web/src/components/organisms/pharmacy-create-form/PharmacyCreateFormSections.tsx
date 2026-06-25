'use client'

import type { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { FormSection } from '@/components/molecules/FormSection'
import { PharmacyContactFields } from '@/components/molecules/PharmacyContactFields'
import { PharmacyProfileBanner } from '@/components/molecules/PharmacyProfileBanner'
import { PharmacySelects } from '@/components/molecules/PharmacySelects'
import { PharmacySiretSearchPanel } from '@/components/molecules/PharmacySiretSearchPanel'
import { toSelectOptions } from '@/lib/form-options'
import { getMissingPharmacyFields } from '@/view-models/pharmacy-profile'
import type { SiretSearchFeedback } from '@/hooks/use-pharmacy-siret-search'
import type { PharmacyInput, PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'

type Ref = { id: string; name: string }
type ComboboxOption = { value: string; label: string }

type Props = {
  register: UseFormRegister<PharmacyInput>
  errors: FieldErrors<PharmacyInput>
  setValue: UseFormSetValue<PharmacyInput>
  getValues: UseFormGetValues<PharmacyInput>
  watch: (name: keyof PharmacyInput) => unknown
  groupements: Ref[]
  softwares: Ref[]
  searching: boolean
  onRunSiret: () => void
  feedback: SiretSearchFeedback | null
  candidates: PharmacySiretLookup[]
  onPickMatch: (match: PharmacySiretLookup) => void
  onCreateGroupement: (name: string) => Promise<ComboboxOption>
  onCreateSoftware: (name: string) => Promise<ComboboxOption>
}

export function PharmacyCreateFormSections(props: Props) {
  const missingFields = getMissingPharmacyFields({
    city: (props.watch('city') as string | undefined) ?? null,
    postalCode: (props.watch('postalCode') as string | undefined) ?? null,
  })

  return (
    <>
      <PharmacyProfileBanner missingFields={missingFields} />
      <FormSection title="Identité légale">
        <PharmacySiretSearchPanel
          register={props.register}
          errors={props.errors}
          searching={props.searching}
          onRunSiret={props.onRunSiret}
          feedback={props.feedback}
          candidates={props.candidates}
          onPick={props.onPickMatch}
        />
      </FormSection>
      <FormSection title="Coordonnées">
        <PharmacyContactFields
          register={props.register}
          setValue={props.setValue}
          getValues={props.getValues}
          errors={props.errors}
        />
      </FormSection>
      <FormSection title="Référentiels">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PharmacySelects
            status={(props.watch('status') as string) ?? 'PROSPECT'}
            onStatus={(v) => props.setValue('status', v as PharmacyInput['status'])}
            groupementId={props.watch('groupementId') as string | undefined}
            onGroupement={(v) => props.setValue('groupementId', v)}
            groupements={toSelectOptions(props.groupements)}
            onCreateGroupement={props.onCreateGroupement}
            softwareId={props.watch('softwareId') as string | undefined}
            onSoftware={(v) => props.setValue('softwareId', v)}
            softwares={toSelectOptions(props.softwares)}
            onCreateSoftware={props.onCreateSoftware}
          />
        </div>
      </FormSection>
    </>
  )
}
