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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CandidateCreateInput>({
    resolver: zodResolver(candidateCreateInputSchema),
    defaultValues,
    values: defaultValues,
  })

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Créer le candidat"
      description="Complète les infos manquantes puis crée le candidat en CVthèque."
      className="max-w-lg"
      trapFocus
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Prénom" htmlFor="firstName" error={errors.firstName?.message}>
            <Input id="firstName" {...register('firstName')} />
          </FormField>
          <FormField label="Nom" htmlFor="lastName" error={errors.lastName?.message}>
            <Input id="lastName" {...register('lastName')} />
          </FormField>
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register('email')} />
          </FormField>
          <FormField label="Téléphone" htmlFor="phone" error={errors.phone?.message}>
            <Input id="phone" {...register('phone')} />
          </FormField>
          <FormField label="Ville" htmlFor="city" error={errors.city?.message}>
            <Input id="city" {...register('city')} />
          </FormField>
          <FormField label="Code postal" htmlFor="postalCode" error={errors.postalCode?.message}>
            <Input id="postalCode" {...register('postalCode')} />
          </FormField>
        </div>
        <FormField label="Métier" htmlFor="jobTitleId" error={errors.jobTitleId?.message}>
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
