'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  pharmacyInputSchema,
  type PharmacyInput,
  type PharmacySiretLookup,
} from '@/view-models/pharmacy-form.schema'
import { usePharmacySiretSearch } from '@/hooks/use-pharmacy-siret-search'
import { usePharmacyRefOptions } from '@/lib/hooks/use-pharmacy-ref-options'
import { Button } from '@/components/atoms/Button'
import { FormSection } from '@/components/molecules/FormSection'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { PharmacyContactFields } from '@/components/molecules/PharmacyContactFields'
import { PharmacyProfileBanner } from '@/components/molecules/PharmacyProfileBanner'
import { PharmacyFormReferentialsSection } from '@/components/molecules/PharmacyFormReferentialsSection'
import { PharmacySiretSearchPanel } from '@/components/molecules/PharmacySiretSearchPanel'
import { getMissingPharmacyFields } from '@/view-models/pharmacy-profile'

type Ref = { id: string; name: string }

type Props = {
  defaultValues?: Partial<PharmacyInput>
  groupements: Ref[]
  softwares: Ref[]
  submitting: boolean
  errorMessage?: string | null
  onSubmit: (data: PharmacyInput) => void
  onSearchSiret: (query: string) => Promise<PharmacySiretLookup[]>
  onCreateGroupement: (name: string) => Promise<Ref>
  onCreateSoftware: (name: string) => Promise<Ref>
}

export function PharmacyForm(props: Props) {
  const { register, handleSubmit, setValue, getValues, watch, formState } = useForm<PharmacyInput>({
    resolver: zodResolver(pharmacyInputSchema),
    defaultValues: { status: 'PROSPECT', ...props.defaultValues },
  })
  const refs = usePharmacyRefOptions(props.groupements, props.softwares)
  const siret = usePharmacySiretSearch(getValues, setValue, props.onSearchSiret)
  const missingFields = getMissingPharmacyFields({
    city: watch('city') ?? null,
    postalCode: watch('postalCode') ?? null,
  })

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="flex flex-col gap-6" noValidate>
      {props.errorMessage ? <FormErrorBanner message={props.errorMessage} /> : null}
      <PharmacyProfileBanner missingFields={missingFields} />
      <FormSection title="Identité légale">
        <PharmacySiretSearchPanel
          register={register}
          errors={formState.errors}
          searching={siret.searching}
          onRunSiret={siret.runSiret}
          feedback={siret.feedback}
          candidates={siret.candidates}
          onPick={siret.pickMatch}
        />
      </FormSection>
      <FormSection title="Coordonnées">
        <PharmacyContactFields register={register} setValue={setValue} getValues={getValues} errors={formState.errors} />
      </FormSection>
      <FormSection title="Référentiels">
        <PharmacyFormReferentialsSection
          status={watch('status') ?? 'PROSPECT'}
          groupementId={watch('groupementId')}
          softwareId={watch('softwareId')}
          groupements={refs.groupementOptions}
          softwares={refs.softwareOptions}
          onStatus={(value) => setValue('status', value)}
          onGroupement={(value) => setValue('groupementId', value)}
          onSoftware={(value) => setValue('softwareId', value)}
          onCreateGroupement={refs.addGroupement(props.onCreateGroupement)}
          onCreateSoftware={refs.addSoftware(props.onCreateSoftware)}
        />
      </FormSection>
      <div className="flex justify-end border-t border-border/50 pt-4">
        <Button type="submit" variant="accent" disabled={props.submitting} className="shadow-md shadow-accent/20">
          {props.submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
