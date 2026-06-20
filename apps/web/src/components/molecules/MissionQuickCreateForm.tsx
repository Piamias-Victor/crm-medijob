'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  missionQuickCreateSchema,
  type MissionQuickCreateInput,
} from '@/view-models/mission-quick-create.schema'
import { Button } from '@/components/atoms/Button'
import { MissionQuickCreateFields } from '@/components/molecules/MissionQuickCreateFields'

type Ref = { id: string; name: string }

type Props = {
  pharmacyId: string
  jobTitles: Ref[]
  recruiters: Ref[]
  submitting: boolean
  onSubmit: (data: MissionQuickCreateInput) => void
  onCreateJobTitle: (name: string) => Promise<Ref>
}

export function MissionQuickCreateForm({
  pharmacyId,
  jobTitles: initialJobTitles,
  recruiters,
  submitting,
  onSubmit,
  onCreateJobTitle,
}: Props) {
  const [jobTitles, setJobTitles] = useState(initialJobTitles)
  const form = useForm<MissionQuickCreateInput>({
    resolver: zodResolver(missionQuickCreateSchema),
    defaultValues: {
      pharmacyId,
      contractType: 'CDI',
      referentId: recruiters[0]?.id,
      jobTitleId: initialJobTitles[0]?.id,
    },
  })

  const createJobTitle = async (name: string) => {
    const created = await onCreateJobTitle(name)
    setJobTitles((prev) => [...prev, created])
    return { value: created.id, label: created.name }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4 rounded-xl border border-border/55 bg-white/70 p-4 sm:grid-cols-2"
      noValidate
    >
      <MissionQuickCreateFields
        register={form.register}
        setValue={form.setValue}
        watch={form.watch}
        errors={form.formState.errors}
        jobTitles={jobTitles}
        recruiters={recruiters}
        onCreateJobTitle={createJobTitle}
      />
      <div className="flex items-end sm:col-span-2">
        <Button type="submit" variant="accent" disabled={submitting} className="shadow-md shadow-accent/20">
          {submitting ? 'Création…' : 'Créer la mission'}
        </Button>
      </div>
    </form>
  )
}
