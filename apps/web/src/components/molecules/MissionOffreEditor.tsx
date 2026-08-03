'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import {
  jobOfferFormSchema,
  type JobOfferFormValues,
} from '@/view-models/job-offer-form.schema'

type Props = {
  title: string
  content: string
  submitting: boolean
  onSubmit: (values: JobOfferFormValues) => void
}

export function MissionOffreEditor({ title, content, submitting, onSubmit }: Props) {
  const { register, handleSubmit, reset, formState } = useForm<JobOfferFormValues>({
    resolver: zodResolver(jobOfferFormSchema),
    defaultValues: { title, content },
  })

  useEffect(() => {
    reset({ title, content })
  }, [title, content, reset])

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-fg">Titre</span>
        <Input {...register('title')} />
        {formState.errors.title ? (
          <span className="text-xs text-error">{formState.errors.title.message}</span>
        ) : null}
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-fg">Contenu</span>
        <Textarea rows={12} {...register('content')} />
        {formState.errors.content ? (
          <span className="text-xs text-error">{formState.errors.content.message}</span>
        ) : null}
      </label>
      <div>
        <Button type="submit" variant="accent" disabled={submitting}>
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
