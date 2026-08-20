'use client'

import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import {
  DEVIS_INVOICE_LABEL,
  DEVIS_INVOICE_SAVE_LABEL,
  DEVIS_INVOICE_SAVING_LABEL,
} from '@/view-models/devis-copy'

const schema = z.object({ invoicedAt: z.string().min(1) })
type Values = z.infer<typeof schema>

function toInputDate(value: Date | null) {
  if (!value) return ''
  const year = String(value.getFullYear())
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseFormDate(value: string): Date {
  const parts = value.split('-').map(Number)
  return new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, parts[2] ?? 1)
}

type Props = {
  invoicedAt: Date | null
  submitting: boolean
  onSubmit: (invoicedAt: Date) => void
}

export function DevisInvoiceForm({ invoicedAt, submitting, onSubmit }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema) as Resolver<Values>,
    defaultValues: { invoicedAt: toInputDate(invoicedAt) },
  })

  useEffect(() => {
    form.reset({ invoicedAt: toInputDate(invoicedAt) })
  }, [form, invoicedAt])

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      noValidate
      onSubmit={form.handleSubmit((data) => onSubmit(parseFormDate(data.invoicedAt)))}
    >
      <FormField label={DEVIS_INVOICE_LABEL} htmlFor="devis-invoiced-at" error={form.formState.errors.invoicedAt?.message}>
        <Input id="devis-invoiced-at" type="date" {...form.register('invoicedAt')} />
      </FormField>
      <div className="flex items-end">
        <Button type="submit" variant="outline" disabled={submitting}>
          {submitting ? DEVIS_INVOICE_SAVING_LABEL : DEVIS_INVOICE_SAVE_LABEL}
        </Button>
      </div>
    </form>
  )
}
