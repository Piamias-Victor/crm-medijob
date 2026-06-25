'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/atoms/Button'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { PharmacyCreateFormSections } from '@/components/organisms/pharmacy-create-form/PharmacyCreateFormSections'
import { usePharmacySiretSearch } from '@/hooks/use-pharmacy-siret-search'
import { usePharmacyCreateForm } from '@/lib/hooks/use-pharmacy-create-form'
import { usePharmacyCreateMutations } from '@/lib/hooks/use-pharmacy-create-mutations'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'

type Ref = { id: string; name: string }

type Props = {
  defaultValues: PharmacyInput
  groupements: Ref[]
  softwares: Ref[]
}

export function PharmacyCreateForm({ defaultValues, groupements, softwares }: Props) {
  const utils = trpc.useUtils()
  const { create, createGroupement, createSoftware } = usePharmacyCreateMutations()
  const [groupementOptions, setGroupementOptions] = useState(groupements)
  const [softwareOptions, setSoftwareOptions] = useState(softwares)
  const form = usePharmacyCreateForm(defaultValues)
  const { register, handleSubmit, setValue, getValues, watch, formState } = form
  const { searching, runSiret } = usePharmacySiretSearch(
    getValues,
    setValue,
    (query) => utils.pharmacy.searchSiret.fetch({ query }),
  )
  const addRef =
    (setter: typeof setGroupementOptions, fn: typeof createGroupement.mutateAsync) =>
    async (name: string) => {
      const ref = await fn({ name })
      setter((prev) => [...prev, ref])
      return { value: ref.id, label: ref.name }
    }

  return (
    <form onSubmit={handleSubmit((data) => create.mutate(data))} className="flex flex-col gap-8" noValidate>
      {create.error ? <FormErrorBanner message={create.error.message} /> : null}
      <PharmacyCreateFormSections
        register={register}
        errors={formState.errors}
        setValue={setValue}
        getValues={getValues}
        watch={watch}
        groupements={groupementOptions}
        softwares={softwareOptions}
        searching={searching}
        onRunSiret={runSiret}
        onCreateGroupement={addRef(setGroupementOptions, createGroupement.mutateAsync)}
        onCreateSoftware={addRef(setSoftwareOptions, createSoftware.mutateAsync)}
      />
      <div className="flex justify-end border-t border-border/60 pt-4">
        <Button type="submit" variant="accent" disabled={create.isPending} className="shadow-md shadow-accent/20">
          {create.isPending ? 'Création…' : 'Créer la pharmacie'}
        </Button>
      </div>
    </form>
  )
}
