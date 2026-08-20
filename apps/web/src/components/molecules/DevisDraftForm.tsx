'use client'

import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { devisFormSchema } from '@/view-models/devis.schema'
import type { DevisFormValues } from '@/view-models/devis-form'
import { DevisDraftFields } from '@/components/molecules/DevisDraftFields'
import { DevisDraftActions } from '@/components/molecules/DevisDraftActions'

type Props = {
  values: DevisFormValues
  submitting: boolean
  sending: boolean
  deleting: boolean
  hasDraft: boolean
  onSubmit: (data: DevisFormValues) => void
  onSend: (data: DevisFormValues) => void
  onDelete?: () => void
}

export function DevisDraftForm({
  values,
  submitting,
  sending,
  deleting,
  hasDraft,
  onSubmit,
  onSend,
  onDelete,
}: Props) {
  const form = useForm<DevisFormValues>({
    resolver: zodResolver(devisFormSchema) as Resolver<DevisFormValues>,
    defaultValues: values,
  })

  useEffect(() => {
    form.reset(values)
  }, [form, values])

  const parsed = (data: DevisFormValues) => devisFormSchema.parse(data)

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      noValidate
      onSubmit={form.handleSubmit((data) => onSubmit(parsed(data)))}
    >
      <input type="hidden" {...form.register('htSource')} />
      <DevisDraftFields
        register={form.register}
        setValue={form.setValue}
        getValues={form.getValues}
        watch={form.watch}
        errors={form.formState.errors}
      />
      <DevisDraftActions
        submitting={submitting}
        sending={sending}
        deleting={deleting}
        hasDraft={hasDraft}
        onDelete={onDelete}
        onSend={form.handleSubmit((data) => onSend(parsed(data)))}
      />
    </form>
  )
}
