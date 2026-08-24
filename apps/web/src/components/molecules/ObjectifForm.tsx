'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import { objectifSchema, type ObjectifInput } from '@/server/admin/objectif-schema'
import { OBJECTIF_FIELDS } from '@/view-models/objectif'

type Props = {
  defaultValues: ObjectifInput
  submitting: boolean
  onSubmit: (data: ObjectifInput) => void
}

export function ObjectifForm({ defaultValues, submitting, onSubmit }: Props) {
  const form = useForm<ObjectifInput>({
    resolver: zodResolver(objectifSchema),
    defaultValues,
  })
  const errors = form.formState.errors

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {OBJECTIF_FIELDS.map((field) => (
          <FormField
            key={field.name}
            label={field.label}
            htmlFor={field.name}
            error={errors[field.name]?.message}
          >
            <Input
              id={field.name}
              type="number"
              min={1}
              step="1"
              {...form.register(field.name, { valueAsNumber: true })}
            />
          </FormField>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="accent" disabled={submitting} className="shadow-md shadow-accent/20">
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
