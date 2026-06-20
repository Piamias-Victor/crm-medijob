'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  candidateQuickCreateSchema,
  type CandidateQuickCreateInput,
} from '@/view-models/candidate-quick-create.schema'
import { Button } from '@/components/atoms/Button'
import { CandidateQuickCreateFields } from '@/components/molecules/CandidateQuickCreateFields'

type Ref = { id: string; name: string }

type Props = {
  jobTitles: Ref[]
  recruiters: Ref[]
  submitting: boolean
  onSubmit: (data: CandidateQuickCreateInput) => void
}

export function CandidateQuickCreateForm({ jobTitles, recruiters, submitting, onSubmit }: Props) {
  const form = useForm<CandidateQuickCreateInput>({
    resolver: zodResolver(candidateQuickCreateSchema),
    defaultValues: {
      jobTitleId: jobTitles[0]?.id,
      referentId: recruiters[0]?.id,
    },
  })

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4 sm:grid-cols-2"
      noValidate
    >
      <CandidateQuickCreateFields
        register={form.register}
        setValue={form.setValue}
        watch={form.watch}
        errors={form.formState.errors}
        jobTitles={jobTitles}
        recruiters={recruiters}
      />
      <div className="flex items-end sm:col-span-2">
        <Button type="submit" variant="accent" disabled={submitting} className="shadow-md shadow-accent/20">
          {submitting ? 'Création…' : 'Créer le candidat'}
        </Button>
      </div>
    </form>
  )
}
