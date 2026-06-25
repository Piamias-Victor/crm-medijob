'use client'

import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { PharmacyLegalFields } from '@/components/molecules/PharmacyLegalFields'
import { SiretLookupPicker } from '@/components/molecules/SiretLookupPicker'
import { SiretSearchButton } from '@/components/molecules/SiretSearchButton'
import { SiretSearchFeedback } from '@/components/molecules/SiretSearchFeedback'
import type { SiretSearchFeedback as Feedback } from '@/hooks/use-pharmacy-siret-search'
import type { PharmacyInput, PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'

type Props = {
  register: UseFormRegister<PharmacyInput>
  errors: FieldErrors<PharmacyInput>
  searching: boolean
  onRunSiret: () => void
  feedback: Feedback | null
  candidates: PharmacySiretLookup[]
  onPick: (match: PharmacySiretLookup) => void
}

export function PharmacySiretSearchPanel(props: Props) {
  return (
    <div className="flex flex-col gap-3">
      <PharmacyLegalFields
        register={props.register}
        errors={props.errors}
        siretButton={<SiretSearchButton loading={props.searching} onClick={props.onRunSiret} />}
      />
      <SiretSearchFeedback feedback={props.feedback} />
      {props.candidates.length > 0 ? (
        <SiretLookupPicker matches={props.candidates} onPick={props.onPick} />
      ) : null}
    </div>
  )
}
