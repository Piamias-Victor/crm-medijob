'use client'

import { Button } from '@/components/atoms/Button'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { ContactFormSections } from '@/components/molecules/ContactFormSections'
import { useContactCreateForm } from '@/lib/hooks/use-contact-create-form'
import { useContactCreateMutations } from '@/lib/hooks/use-contact-create-mutations'
import { useWatchedPharmacyId } from '@/lib/hooks/use-watched-pharmacy-id'
import { useWatchedPrimaryFlag } from '@/lib/hooks/use-watched-primary-flag'
import type { ContactInput } from '@/view-models/contact-form.schema'

type Ref = { id: string; name: string }

type Props = {
  defaultValues: Partial<ContactInput>
  pharmacies: Ref[]
}

export function ContactCreateForm({ defaultValues, pharmacies }: Props) {
  const { create } = useContactCreateMutations()
  const form = useContactCreateForm(defaultValues)
  const { register, handleSubmit, control, formState } = form
  const pharmacyId = useWatchedPharmacyId(control, defaultValues.pharmacyId)
  const isPrimary = useWatchedPrimaryFlag(control, defaultValues.isPrimary)
  const pharmacyOptions = pharmacies.map((pharmacy) => ({ value: pharmacy.id, label: pharmacy.name }))

  return (
    <form onSubmit={handleSubmit((data) => create.mutate(data))} className="flex flex-col gap-6" noValidate>
      {create.error ? <FormErrorBanner message={create.error.message} /> : null}
      <ContactFormSections
        register={register}
        control={control}
        errors={formState.errors}
        pharmacyOptions={pharmacyOptions}
        pharmacyId={pharmacyId}
        isPrimary={isPrimary}
      />
      <div className="flex justify-end border-t border-border/50 pt-4">
        <Button type="submit" variant="accent" disabled={create.isPending} className="shadow-md shadow-accent/20">
          {create.isPending ? 'Création…' : 'Créer le contact'}
        </Button>
      </div>
    </form>
  )
}
