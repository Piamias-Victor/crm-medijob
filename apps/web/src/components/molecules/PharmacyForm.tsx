'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  pharmacyInputSchema,
  type PharmacyInput,
  type PharmacySiretLookup,
} from '@/view-models/pharmacy-form.schema'
import { usePharmacySiretSearch } from '@/hooks/use-pharmacy-siret-search'
import { Button } from '@/components/atoms/Button'
import { FormSection } from '@/components/molecules/FormSection'
import { PharmacyLegalFields } from '@/components/molecules/PharmacyLegalFields'
import { PharmacyContactFields } from '@/components/molecules/PharmacyContactFields'
import { PharmacyProfileBanner } from '@/components/molecules/PharmacyProfileBanner'
import { SiretSearchButton } from '@/components/molecules/SiretSearchButton'
import { PharmacySelects } from '@/components/molecules/PharmacySelects'
import { getMissingPharmacyFields } from '@/view-models/pharmacy-profile'

import { toSelectOptions } from '@/lib/form-options'

type Ref = { id: string; name: string }

type Props = {
  defaultValues?: Partial<PharmacyInput>
  groupements: Ref[]
  softwares: Ref[]
  submitting: boolean
  onSubmit: (data: PharmacyInput) => void
  onSearchSiret: (query: string) => Promise<PharmacySiretLookup[]>
  onCreateGroupement: (name: string) => Promise<Ref>
  onCreateSoftware: (name: string) => Promise<Ref>
}

export function PharmacyForm(props: Props) {
  const { register, handleSubmit, setValue, getValues, watch, formState } = useForm<PharmacyInput>({
    resolver: zodResolver(pharmacyInputSchema),
    defaultValues: { status: 'PROSPECT', ...props.defaultValues },
  })
  const [groupements, setGroupements] = useState(props.groupements)
  const [softwares, setSoftwares] = useState(props.softwares)
  const { searching, runSiret } = usePharmacySiretSearch(getValues, setValue, props.onSearchSiret)
  const addRef =
    (setter: typeof setGroupements, fn: (name: string) => Promise<Ref>) => async (name: string) => {
      const ref = await fn(name)
      setter((prev) => [...prev, ref])
      return { value: ref.id, label: ref.name }
    }
  const missingFields = getMissingPharmacyFields({
    city: watch('city') ?? null,
    postalCode: watch('postalCode') ?? null,
  })

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="flex flex-col gap-6" noValidate>
      <PharmacyProfileBanner missingFields={missingFields} />
      <FormSection title="Identité légale">
        <PharmacyLegalFields
          register={register}
          errors={formState.errors}
          siretButton={<SiretSearchButton loading={searching} onClick={runSiret} />}
        />
      </FormSection>
      <FormSection title="Coordonnées">
        <PharmacyContactFields
          register={register}
          setValue={setValue}
          getValues={getValues}
          errors={formState.errors}
        />
      </FormSection>
      <FormSection title="Référentiels">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PharmacySelects
            status={watch('status') ?? 'PROSPECT'}
            onStatus={(v) => setValue('status', v as PharmacyInput['status'])}
            groupementId={watch('groupementId')}
            onGroupement={(v) => setValue('groupementId', v)}
            groupements={toSelectOptions(groupements)}
            onCreateGroupement={addRef(setGroupements, props.onCreateGroupement)}
            softwareId={watch('softwareId')}
            onSoftware={(v) => setValue('softwareId', v)}
            softwares={toSelectOptions(softwares)}
            onCreateSoftware={addRef(setSoftwares, props.onCreateSoftware)}
          />
        </div>
      </FormSection>
      <div className="flex justify-end border-t border-border/50 pt-4">
        <Button type="submit" variant="accent" disabled={props.submitting} className="shadow-md shadow-accent/20">
          {props.submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
