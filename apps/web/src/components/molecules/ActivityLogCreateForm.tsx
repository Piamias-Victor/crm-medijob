'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ACTIVITY_TYPES } from '@/view-models/activity-log-form.schema'
import { ACTIVITY_TYPE_OPTIONS } from '@/lib/activity-log-options'
import { formatIsoDate } from '@/lib/date-picker-utils'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { FormField } from '@/components/molecules/FormField'
import { Combobox } from '@/components/molecules/Combobox'
import { DatePicker } from '@/components/molecules/DatePicker'

const formSchema = z.object({
  type: z.enum(ACTIVITY_TYPES),
  content: z.string().trim().optional(),
  date: z.string().min(1, 'Date requise'),
})

type FormValues = z.infer<typeof formSchema>
type SubmitValues = { type: FormValues['type']; content?: string; date: Date }

type Props = {
  submitting: boolean
  onSubmit: (data: SubmitValues) => void
}

export function ActivityLogCreateForm({ submitting, onSubmit }: Props) {
  const { register, handleSubmit, control, setValue, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: 'NOTE', date: formatIsoDate(new Date()) },
  })

  const submit = (values: FormValues) => {
    onSubmit({
      type: values.type,
      content: values.content?.trim() || undefined,
      date: new Date(`${values.date}T12:00:00`),
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Type" error={formState.errors.type?.message}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Combobox
                value={field.value}
                onChange={field.onChange}
                options={ACTIVITY_TYPE_OPTIONS}
                placeholder="Choisir un type"
              />
            )}
          />
        </FormField>
        <FormField label="Date" htmlFor="activity-date" error={formState.errors.date?.message}>
          <DatePicker
            id="activity-date"
            value={watch('date')}
            onChange={(value) => setValue('date', value ?? '', { shouldValidate: true })}
          />
        </FormField>
      </div>
      <FormField label="Contenu" htmlFor="activity-content">
        <Textarea id="activity-content" rows={3} placeholder="Détails de l'échange…" {...register('content')} />
      </FormField>
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Enregistrement…' : 'Ajouter'}
        </Button>
      </div>
    </form>
  )
}
