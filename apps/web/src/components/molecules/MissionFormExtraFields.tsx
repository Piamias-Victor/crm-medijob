'use client'

import type { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form'
import type { MissionInput } from '@/view-models/mission-form.schema'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { FormField } from '@/components/molecules/FormField'

const TEMPS_PLEIN = 'temps-plein'

type Props = {
  register: UseFormRegister<MissionInput>
  setValue: UseFormSetValue<MissionInput>
  watch: UseFormWatch<MissionInput>
  errors: FieldErrors<MissionInput>
}

export function MissionFormExtraFields({ register, setValue, watch, errors }: Props) {
  const tempsPlein = watch('tempsPlein')

  return (
    <>
      <FormField label="Salaire min (€)" error={errors.salaireMin?.message}>
        <Input type="number" min={0} {...register('salaireMin')} />
      </FormField>
      <FormField label="Salaire max (€)" error={errors.salaireMax?.message}>
        <Input type="number" min={0} {...register('salaireMax')} />
      </FormField>
      <FormField label="Notes salaire" error={errors.salaireNotes?.message}>
        <Input {...register('salaireNotes')} />
      </FormField>
      <FormField label="Heures / semaine" error={errors.heuresParSemaine?.message}>
        <Input type="number" min={0} step={0.5} {...register('heuresParSemaine')} />
      </FormField>
      <FormField label="Planning" error={errors.planning?.message}>
        <Input {...register('planning')} placeholder="Ex. Jour, alterné…" />
      </FormField>
      <FormField label="Temps plein">
        <CheckboxGroup
          options={[{ value: TEMPS_PLEIN, label: 'Poste à temps plein' }]}
          values={tempsPlein ? [TEMPS_PLEIN] : []}
          onChange={(values) =>
            setValue('tempsPlein', values.includes(TEMPS_PLEIN), { shouldValidate: true })
          }
        />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Description" error={errors.description?.message}>
          <Textarea rows={3} {...register('description')} />
        </FormField>
      </div>
      <div className="sm:col-span-2">
        <FormField label="Notes internes" error={errors.notes?.message}>
          <Textarea rows={3} {...register('notes')} />
        </FormField>
      </div>
    </>
  )
}
