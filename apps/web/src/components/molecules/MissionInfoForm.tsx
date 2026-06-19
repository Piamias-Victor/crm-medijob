'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/lib/trpc/client'
import {
  missionInputSchema,
  type MissionFormValues,
  type MissionInput,
} from '@/view-models/mission-form.schema'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import { toMissionFormValues } from '@/view-models/mission-form'
import { Button } from '@/components/atoms/Button'
import { MissionFormFields } from '@/components/molecules/MissionFormFields'

type Ref = { id: string; name: string }

type Props = {
  mission: MissionDetailPayload
  jobTitles: Ref[]
  pharmacies: Ref[]
  recruiters: Ref[]
  submitting: boolean
  onSubmit: (data: MissionFormValues) => void
  onCreateJobTitle: (name: string) => Promise<Ref>
}

export function MissionInfoForm(props: Props) {
  const { mission } = props
  const [jobTitles, setJobTitles] = useState(props.jobTitles)
  const utils = trpc.useUtils()
  const pharmacyId = mission.formSource.pharmacyId
  const { data: contacts = [] } = trpc.contact.listByPharmacy.useQuery({ pharmacyId })

  const form = useForm<MissionInput>({
    resolver: zodResolver(missionInputSchema),
    defaultValues: toMissionFormValues(mission.formSource),
  })

  useEffect(() => {
    form.reset(toMissionFormValues(mission.formSource))
  }, [form, mission.formSource, mission.updatedAt])

  const createJobTitle = async (name: string) => {
    const created = await props.onCreateJobTitle(name)
    setJobTitles((prev) => [...prev, created])
    return { value: created.id, label: created.name }
  }

  return (
    <form
      key={mission.id + mission.updatedAt.toISOString()}
      onSubmit={form.handleSubmit((data) => props.onSubmit(missionInputSchema.parse(data)))}
      className="grid gap-4 sm:grid-cols-2"
      noValidate
    >
      <MissionFormFields
        register={form.register}
        setValue={form.setValue}
        watch={form.watch}
        errors={form.formState.errors}
        jobTitles={jobTitles}
        pharmacies={props.pharmacies}
        recruiters={props.recruiters}
        contacts={contacts}
        onCreateJobTitle={createJobTitle}
        onPharmacyChange={(id) => utils.contact.listByPharmacy.invalidate({ pharmacyId: id })}
      />
      <div className="flex items-end sm:col-span-2">
        <Button type="submit" variant="accent" disabled={props.submitting}>
          {props.submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
