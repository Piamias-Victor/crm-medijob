'use client'

import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applyCalculate } from '@/lib/finance/devis-draft'
import { devisFormSchema } from '@/view-models/devis.schema'
import type { DevisFormValues } from '@/view-models/devis-form'
import { DEVIS_CALCULATE_LABEL, DEVIS_SAVE_LABEL } from '@/view-models/devis-copy'
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

  const kind = form.watch('kind')

  const onCalculate = () => {
    const parsed = devisFormSchema.safeParse(form.getValues())
    if (!parsed.success) return
    const next = applyCalculate({ ...parsed.data, amountTtc: null })
    form.setValue('amountHt', next.amountHt)
    form.setValue('htSource', next.htSource)
  }

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
        watch={form.watch}
        errors={form.formState.errors}
      />
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        {kind === 'INTERIM' ? (
          <Button type="button" variant="outline" onClick={onCalculate}>
            {DEVIS_CALCULATE_LABEL}
          </Button>
        ) : null}
        <Button type="submit" variant="accent" disabled={submitting}>
          {submitting ? 'Enregistrement…' : DEVIS_SAVE_LABEL}
        </Button>
      </div>
    </form>
  )
}
