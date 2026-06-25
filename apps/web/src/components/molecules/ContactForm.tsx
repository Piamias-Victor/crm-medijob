'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactInputSchema, type ContactInput } from '@/view-models/contact-form.schema'
import { Button } from '@/components/atoms/Button'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { ContactFormSections } from '@/components/molecules/ContactFormSections'
import { useWatchedPharmacyId } from '@/lib/hooks/use-watched-pharmacy-id'
import { useWatchedPrimaryFlag } from '@/lib/hooks/use-watched-primary-flag'

type Ref = { id: string; name: string }

type Props = {
  defaultValues?: Partial<ContactInput>
  pharmacies: Ref[]
  lockedPharmacyId?: string
  excludeContactId?: string
  submitting: boolean
  errorMessage?: string | null
  onSubmit: (data: ContactInput) => void
}

export function ContactForm({
  defaultValues,
  pharmacies,
  lockedPharmacyId,
  excludeContactId,
  submitting,
  errorMessage,
  onSubmit,
}: Props) {
  const { register, handleSubmit, control, formState } = useForm<ContactInput>({
    resolver: zodResolver(contactInputSchema),
    defaultValues: { role: 'AUTRE', isPrimary: false, ...defaultValues },
  })
  const pharmacyId = useWatchedPharmacyId(control, defaultValues?.pharmacyId)
  const isPrimary = useWatchedPrimaryFlag(control, defaultValues?.isPrimary)
  const pharmacyOptions = pharmacies.map((p) => ({ value: p.id, label: p.name }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {errorMessage ? <FormErrorBanner message={errorMessage} /> : null}
      {lockedPharmacyId ? <input type="hidden" {...register('pharmacyId')} /> : null}
      <ContactFormSections
        register={register}
        control={control}
        errors={formState.errors}
        pharmacyOptions={pharmacyOptions}
        pharmacyId={pharmacyId}
        isPrimary={isPrimary}
        excludeContactId={excludeContactId}
        lockedPharmacyId={lockedPharmacyId}
      />
      <div className="flex justify-end border-t border-border/50 pt-4">
        <Button type="submit" variant="accent" disabled={submitting} className="shadow-md shadow-accent/20">
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
