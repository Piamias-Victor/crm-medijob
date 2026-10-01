'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Combobox } from '@/components/molecules/Combobox'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'
import {
  standaloneOfferFormSchema,
  type StandaloneOfferFormValues,
} from '@/view-models/standalone-offer-form.schema'

type Props = {
  jobTitleOptions: ComboboxOption[]
  submitting: boolean
  onSubmit: (values: StandaloneOfferFormValues) => void
  onCancel: () => void
}

export function StandaloneOfferCreateForm({
  jobTitleOptions,
  submitting,
  onSubmit,
  onCancel,
}: Props) {
  const { register, handleSubmit, setValue, watch, formState } =
    useForm<StandaloneOfferFormValues>({
      resolver: zodResolver(standaloneOfferFormSchema),
      defaultValues: {
        jobTitleId: '',
        jobTitleName: '',
        city: '',
        postalCode: '',
        contractType: 'CDI',
        tempsPlein: true,
      },
    })

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <Combobox
        value={watch('jobTitleId') || undefined}
        onChange={(id) => {
          const opt = jobTitleOptions.find((o) => o.value === id)
          setValue('jobTitleId', id)
          setValue('jobTitleName', opt?.label ?? '')
        }}
        options={jobTitleOptions}
        placeholder="Métier"
      />
      <Input placeholder="Ville" {...register('city')} />
      <Input placeholder="Code postal (optionnel)" {...register('postalCode')} />
      <select className="rounded-md border px-3 py-2 text-sm" {...register('contractType')}>
        <option value="CDI">CDI</option>
        <option value="CDD">CDD</option>
        <option value="INTERIM">Intérim</option>
        <option value="VACATION">Vacation</option>
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('tempsPlein')} />
        Temps plein
      </label>
      {formState.errors.city ? (
        <p className="text-xs text-error">{formState.errors.city.message}</p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="accent" disabled={submitting}>
          {submitting ? 'Création…' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}
