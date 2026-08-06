'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassModal } from '@/components/molecules/GlassModal'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import { Combobox } from '@/components/molecules/Combobox'
import {
  candidateCreateInputSchema,
  type CandidateCreateInput,
} from '@/view-models/candidate-profile.schema'
import type { RefItem } from '@/view-models/referential'
import { toSelectOptions } from '@/lib/form-options'

type Props = {
  open: boolean
  defaultValues: CandidateCreateInput
  jobTitles: RefItem[]
  submitting: boolean
  onClose: () => void
  onSubmit: (data: CandidateCreateInput) => void
}

export function AppProfileAcceptModal({
  open,
  defaultValues,
  jobTitles,
  submitting,
  onClose,
  onSubmit,
}: Props) {
  const form = useForm<CandidateCreateInput>({
    resolver: zodResolver(candidateCreateInputSchema),
    defaultValues,
    values: defaultValues,
  })
  const { register, handleSubmit, setValue, watch, formState } = form

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Créer le candidat"
      description="CV Badakan importé à la validation s’il existe. Complète le reste si besoin."
      className="max-w-lg"
      trapFocus
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Prénom" htmlFor="firstName" error={formState.errors.firstName?.message}>
            <Input id="firstName" {...register('firstName')} />
          </FormField>
          <FormField label="Nom" htmlFor="lastName" error={formState.errors.lastName?.message}>
            <Input id="lastName" {...register('lastName')} />
          </FormField>
          <FormField label="Email" htmlFor="email" error={formState.errors.email?.message}>
            <Input id="email" type="email" {...register('email')} />
          </FormField>
          <FormField label="Téléphone" htmlFor="phone" error={formState.errors.phone?.message}>
            <Input id="phone" {...register('phone')} />
          </FormField>
          <FormField label="Ville" htmlFor="city" error={formState.errors.city?.message}>
            <Input id="city" {...register('city')} />
          </FormField>
          <FormField label="Code postal" htmlFor="postalCode" error={formState.errors.postalCode?.message}>
            <Input id="postalCode" {...register('postalCode')} />
          </FormField>
        </div>
        <FormField label="Adresse" htmlFor="address" error={formState.errors.address?.message}>
          <Input id="address" {...register('address')} />
        </FormField>
        <FormField label="Métier" htmlFor="jobTitleId" error={formState.errors.jobTitleId?.message}>
          <Combobox
            value={watch('jobTitleId')}
            onChange={(value) => setValue('jobTitleId', value, { shouldValidate: true })}
            options={toSelectOptions(jobTitles)}
            placeholder="Choisir un métier"
          />
        </FormField>
        <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="accent" disabled={submitting}>
            Créer dans la CVthèque
          </Button>
        </div>
      </form>
    </GlassModal>
  )
}
