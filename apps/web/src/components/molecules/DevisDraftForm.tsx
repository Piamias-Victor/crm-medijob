'use client'

import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { devisFormSchema } from '@/view-models/devis.schema'
import type { DevisFormValues } from '@/view-models/devis-form'
import { DEVIS_SAVE_LABEL } from '@/view-models/devis-copy'
import { Button } from '@/components/atoms/Button'
import { DevisDraftFields } from '@/components/molecules/DevisDraftFields'

type Props = {
  values: DevisFormValues
  submitting: boolean
  onSubmit: (data: DevisFormValues) => void
}

export function DevisDraftForm({ values, submitting, onSubmit }: Props) {
  const form = useForm<DevisFormValues>({
    resolver: zodResolver(devisFormSchema) as Resolver<DevisFormValues>,
    defaultValues: values,
  })

  useEffect(() => {
    form.reset(values)
  }, [form, values])

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      noValidate
      onSubmit={form.handleSubmit((data) => onSubmit(devisFormSchema.parse(data)))}
    >
      <input type="hidden" {...form.register('htSource')} />
      <DevisDraftFields
        register={form.register}
        setValue={form.setValue}
        getValues={form.getValues}
        watch={form.watch}
        errors={form.formState.errors}
      />
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <Button type="submit" variant="accent" disabled={submitting}>
          {submitting ? 'Enregistrement…' : DEVIS_SAVE_LABEL}
        </Button>
      </div>
    </form>
  )
}
