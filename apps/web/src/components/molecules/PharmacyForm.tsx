'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pharmacyInputSchema, type PharmacyInput } from '@/server/routers/pharmacy.schema'
import { computeNumeroTVA } from '@/lib/tva'
import type { SiretResult } from '@/server/services/siret'
import { Button } from '@/components/atoms/Button'
import { PharmacyFormFields } from '@/components/molecules/PharmacyFormFields'
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
  onSearchSiret: (query: string) => Promise<SiretResult[]>
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
  const [searching, setSearching] = useState(false)

  const runSiret = async () => {
    const query = getValues('siret')?.trim() || getValues('name')?.trim()
    if (!query) return
    setSearching(true)
    try {
      const [m] = await props.onSearchSiret(query)
      if (!m) return
      setValue('name', m.name)
      setValue('siret', m.siret)
      setValue('address', m.address)
      setValue('city', m.city)
      setValue('postalCode', m.postalCode)
      const tva = computeNumeroTVA(m.siret)
      if (tva) setValue('numeroTVA', tva)
    } finally {
      setSearching(false)
    }
  }

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
    <form onSubmit={handleSubmit(props.onSubmit)} className="flex flex-col gap-5" noValidate>
      <PharmacyFormFields
        register={register}
        errors={formState.errors}
        siretButton={<SiretSearchButton loading={searching} onClick={runSiret} />}
        selects={
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
        }
      />
      <Button type="submit" disabled={props.submitting} className="self-end">
        {props.submitting ? 'Enregistrement…' : 'Enregistrer'}
      </Button>
    </form>
  )
}
