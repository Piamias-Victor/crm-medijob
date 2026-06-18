'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { CandidateProfileFields } from '@/components/molecules/CandidateProfileFields'
import { CandidateProfileSelects } from '@/components/molecules/CandidateProfileSelects'
import { CandidateProfileBanner } from '@/components/molecules/CandidateProfileBanner'
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

  return (
    <form onSubmit={handleSubmit((data) => update.mutate({ id: candidateId, data }))} className="flex flex-col gap-6" noValidate>
      <CandidateProfileBanner missingFields={missingFields} />
      <CandidateProfileFields
        register={register}
        errors={formState.errors}
        setValue={setValue}
        getValues={getValues}
        availableFrom={watch('availableFrom')}
        onAvailableFrom={(v) => setValue('availableFrom', v)}
      />
      <CandidateProfileSelects
        jobTitleId={watch('jobTitleId')}
        onJobTitle={(v) => setValue('jobTitleId', v)}
        jobTitles={toOptions(referentials.jobTitles)}
        softwareIds={watch('softwareIds') ?? []}
        onSoftwareIds={(v) => setValue('softwareIds', v)}
        softwares={toOptions(referentials.softwares)}
        contractTypes={watch('contractTypes') ?? []}
        onContractTypes={(v) => setValue('contractTypes', v as CandidateProfileInput['contractTypes'])}
        referentId={watch('referentId')}
        onReferent={(v) => setValue('referentId', v)}
        recruiters={toOptions(referentials.recruiters)}
      />
      <Button type="submit" disabled={update.isPending} className="self-end">
        {update.isPending ? 'Enregistrement…' : 'Enregistrer'}
      </Button>
    </form>
  )
}
