'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactInputSchema, type ContactInput } from '@/view-models/contact-form.schema'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { FormSection } from '@/components/molecules/FormSection'
import { ContactAffiliationFields } from '@/components/molecules/ContactAffiliationFields'
import { ContactIdentityFields } from '@/components/molecules/ContactIdentityFields'
import { ContactCoordFields } from '@/components/molecules/ContactCoordFields'
import { PrimaryToggle } from '@/components/molecules/PrimaryToggle'

type Ref = { id: string; name: string }

type Props = {
  defaultValues?: Partial<ContactInput>
  pharmacies: Ref[]
  lockedPharmacyId?: string
  submitting: boolean
  onSubmit: (data: ContactInput) => void
}

export function ContactForm({ defaultValues, pharmacies, lockedPharmacyId, submitting, onSubmit }: Props) {
  const { register, handleSubmit, control, formState } = useForm<ContactInput>({
    resolver: zodResolver(contactInputSchema),
    defaultValues: { role: 'AUTRE', isPrimary: false, ...defaultValues },
  })
  const pharmacyOptions = pharmacies.map((p) => ({ value: p.id, label: p.name }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {lockedPharmacyId ? <input type="hidden" {...register('pharmacyId')} /> : null}
      <FormSection title="Rattachement">
        <ContactAffiliationFields
          control={control}
          pharmacyOptions={pharmacyOptions}
          pharmacyError={formState.errors.pharmacyId?.message}
          lockedPharmacyId={lockedPharmacyId}
        />
      </FormSection>
      <FormSection title="Identité">
        <ContactIdentityFields register={register} errors={formState.errors} />
      </FormSection>
      <FormSection title="Coordonnées">
        <ContactCoordFields register={register} errors={formState.errors} />
      </FormSection>
      <FormSection title="Statut">
        <Controller
          name="isPrimary"
          control={control}
          render={({ field }) => (
            <PrimaryToggle checked={Boolean(field.value)} onChange={field.onChange} />
          )}
        />
      </FormSection>
      <FormSection title="Notes">
        <Textarea id="notes" rows={3} aria-label="Notes" className="rounded-lg bg-white/80" {...register('notes')} />
      </FormSection>
      <div className="flex justify-end border-t border-border/50 pt-4">
        <Button type="submit" variant="accent" disabled={submitting} className="shadow-md shadow-accent/20">
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
