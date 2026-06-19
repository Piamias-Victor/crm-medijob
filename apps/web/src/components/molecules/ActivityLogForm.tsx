'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { Textarea } from '@/components/atoms/Textarea'
import { Combobox } from '@/components/molecules/Combobox'
import { DatePicker } from '@/components/molecules/DatePicker'
import { FormField } from '@/components/molecules/FormField'
import { FormSection } from '@/components/molecules/FormSection'
import { trpc } from '@/lib/trpc/client'
import {
  ACTIVITY_TYPE_OPTIONS,
} from '@/view-models/activity-log.labels'
import type { ActivityLogScope } from '@/view-models/activity-log.types'
import {
  activityLogFormSchema,
  type ActivityLogFormInput,
  type ActivityTypeValue,
} from '@/view-models/activity-log-form.schema'
import { CLEAR_DATE_LABEL, formatIsoDate, parseIsoDate, SELECT_DATE_LABEL } from '@/lib/date-picker-utils'

type Props = { scope: ActivityLogScope }

export function ActivityLogForm({ scope }: Props) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const { register, handleSubmit, setValue, watch, reset, formState } = useForm<ActivityLogFormInput>({
    resolver: zodResolver(activityLogFormSchema),
    defaultValues: {
      type: 'NOTE',
      content: '',
      date: formatIsoDate(new Date()),
    },
  })
  const create = trpc.activityLog.create.useMutation({
    onSuccess: async () => {
      reset({ type: 'NOTE', content: '', date: formatIsoDate(new Date()) })
      await utils.activityLog.listByEntity.invalidate()
      router.refresh()
    },
  })

  const onSubmit = handleSubmit((data) => {
    const date = parseIsoDate(data.date)
    if (!date) return
    create.mutate({
      ...scope,
      type: data.type,
      content: data.content,
      date,
    })
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-border bg-white/60 p-4">
      <FormSection title="Ajouter une activité">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Type" error={formState.errors.type?.message}>
            <Combobox
              value={watch('type')}
              onChange={(value) => setValue('type', value as ActivityTypeValue, { shouldValidate: true })}
              options={ACTIVITY_TYPE_OPTIONS}
            />
          </FormField>
          <FormField label="Date" error={formState.errors.date?.message}>
            <DatePicker
              value={watch('date')}
              emptyLabel={SELECT_DATE_LABEL}
              clearLabel={CLEAR_DATE_LABEL}
              onChange={(value) => setValue('date', value ?? '', { shouldValidate: true })}
            />
          </FormField>
        </div>
        <FormField label="Contenu" error={formState.errors.content?.message}>
          <Textarea rows={3} placeholder="Détails de l'échange…" {...register('content')} />
        </FormField>
        <div className="flex justify-end">
          <Button type="submit" variant="accent" disabled={create.isPending}>
            {create.isPending ? 'Enregistrement…' : 'Ajouter'}
          </Button>
        </div>
      </FormSection>
    </form>
  )
}
