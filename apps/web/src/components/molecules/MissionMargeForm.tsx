'use client'

import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateMargeSchema } from '@/view-models/mission-marge.schema'
import { MARGE_LABEL, MARGE_SAVE_LABEL } from '@/view-models/devis-copy'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'

const formSchema = updateMargeSchema.omit({ id: true })
type Values = { marge: number | null }

type Props = {
  marge: number | null
  submitting: boolean
  onSubmit: (marge: number | null) => void
}

export function MissionMargeForm({ marge, submitting, onSubmit }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(formSchema) as Resolver<Values>,
    defaultValues: { marge },
  })

  useEffect(() => {
    form.reset({ marge })
  }, [form, marge])

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      noValidate
      onSubmit={form.handleSubmit((data) => onSubmit(formSchema.parse(data).marge))}
    >
      <FormField label={MARGE_LABEL} htmlFor="mission-marge" error={form.formState.errors.marge?.message}>
        <Input id="mission-marge" type="number" step="0.01" {...form.register('marge')} />
      </FormField>
      <div className="flex items-end">
        <Button type="submit" variant="outline" disabled={submitting}>
          {submitting ? 'Enregistrement…' : MARGE_SAVE_LABEL}
        </Button>
      </div>
    </form>
  )
}
