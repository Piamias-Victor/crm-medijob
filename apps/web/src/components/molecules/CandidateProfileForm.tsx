'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { CandidateProfileFields } from '@/components/molecules/CandidateProfileFields'
import { CandidateProfileSelects } from '@/components/molecules/CandidateProfileSelects'
import { CandidateProfileBanner } from '@/components/molecules/CandidateProfileBanner'
import { FormSection } from '@/components/molecules/FormSection'
import { trpc } from '@/lib/trpc/client'
import { getMissingMatchingFields } from '@/view-models/candidate-profile'
import {
  candidateProfileInputSchema,
  type CandidateProfileInput,
} from '@/view-models/candidate-profile.schema'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import type { RefItem } from '@/view-models/referential'

type Referentials = {
  jobTitles: RefItem[]
  softwares: RefItem[]
  recruiters: RefItem[]
}

type Props = {
  candidateId: string
  profile: CandidateProfilePayload
  referentials: Referentials
}

const toOptions = (items: RefItem[]) => items.map((i) => ({ value: i.id, label: i.name }))

export function CandidateProfileForm({ candidateId, profile, referentials }: Props) {
  const router = useRouter()
  const update = trpc.candidate.update.useMutation({ onSuccess: () => router.refresh() })
  const createJobTitle = trpc.mission.createJobTitle.useMutation()
  const [jobTitles, setJobTitles] = useState(referentials.jobTitles)
  const { register, handleSubmit, setValue, watch, getValues, formState } = useForm<CandidateProfileInput>({
    resolver: zodResolver(candidateProfileInputSchema),
    defaultValues: profile.formValues,
  })

  const missingFields = getMissingMatchingFields({
    city: watch('city') ?? null,
    postalCode: watch('postalCode') ?? null,
    mobilityRadiusKm: watch('mobilityRadiusKm') ?? null,
    availableFrom: watch('availableFrom') ? new Date(watch('availableFrom')!) : null,
  })

  const onCreateJobTitle = async (name: string) => {
    const created = await createJobTitle.mutateAsync({ name })
    setJobTitles((prev) => [...prev, created])
    return { value: created.id, label: created.name }
  }

  return (
    <form
      onSubmit={handleSubmit((data) => update.mutate({ id: candidateId, data }))}
      className="flex flex-col gap-8"
      noValidate
    >
      <CandidateProfileBanner missingFields={missingFields} />
      <FormSection title="Coordonnées & mobilité">
        <CandidateProfileFields
          register={register}
          errors={formState.errors}
          setValue={setValue}
          getValues={getValues}
          availableFrom={watch('availableFrom')}
          onAvailableFrom={(v) => setValue('availableFrom', v)}
        />
      </FormSection>
      <FormSection title="Référentiels & préférences">
        <CandidateProfileSelects
          jobTitleId={watch('jobTitleId')}
          onJobTitle={(v) => setValue('jobTitleId', v)}
          jobTitles={toOptions(jobTitles)}
          onCreateJobTitle={onCreateJobTitle}
          softwareIds={watch('softwareIds') ?? []}
          onSoftwareIds={(v) => setValue('softwareIds', v)}
          softwares={toOptions(referentials.softwares)}
          contractTypes={watch('contractTypes') ?? []}
          onContractTypes={(v) => setValue('contractTypes', v as CandidateProfileInput['contractTypes'])}
          referentId={watch('referentId')}
          onReferent={(v) => setValue('referentId', v)}
          recruiters={toOptions(referentials.recruiters)}
        />
      </FormSection>
      <div className="flex justify-end border-t border-border/60 pt-4">
        <Button type="submit" variant="accent" disabled={update.isPending} className="shadow-md shadow-accent/20">
          {update.isPending ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
