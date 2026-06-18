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
import { SiretSearchButton } from '@/components/molecules/SiretSearchButton'
import { PharmacySelects } from '@/components/molecules/PharmacySelects'

type Ref = { id: string; name: string }
const toOptions = (refs: Ref[]) => refs.map((r) => ({ value: r.id, label: r.name }))

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

  const createGroupement = async (name: string) => {
    const g = await props.onCreateGroupement(name)
    setGroupements((prev) => [...prev, g])
    return { value: g.id, label: g.name }
  }
  const createSoftware = async (name: string) => {
    const s = await props.onCreateSoftware(name)
    setSoftwares((prev) => [...prev, s])
    return { value: s.id, label: s.name }
  }

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="flex flex-col gap-6" noValidate>
      <FormSection title="Identité légale">
        <PharmacyLegalFields
          register={register}
          errors={formState.errors}
          siretButton={<SiretSearchButton loading={searching} onClick={runSiret} />}
        />
      </FormSection>
      <FormSection title="Coordonnées">
        <PharmacyContactFields register={register} errors={formState.errors} />
      </FormSection>
      <FormSection title="Référentiels">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PharmacySelects
            status={watch('status') ?? 'PROSPECT'}
            onStatus={(v) => setValue('status', v as PharmacyInput['status'])}
            groupementId={watch('groupementId')}
            onGroupement={(v) => setValue('groupementId', v)}
            groupements={toOptions(groupements)}
            onCreateGroupement={createGroupement}
            softwareId={watch('softwareId')}
            onSoftware={(v) => setValue('softwareId', v)}
            softwares={toOptions(softwares)}
            onCreateSoftware={createSoftware}
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
