'use client'

import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { PharmacyLegalFields } from '@/components/molecules/PharmacyLegalFields'
import { SiretLookupPicker } from '@/components/molecules/SiretLookupPicker'
import { SiretSearchAlertModal } from '@/components/molecules/SiretSearchAlertModal'
import { SiretSearchButton } from '@/components/molecules/SiretSearchButton'
import type { AnnuaireSearchSource, SiretSearchFeedback } from '@/hooks/use-pharmacy-siret-search'
import type { PharmacyInput, PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'

type Props = {
  register: UseFormRegister<PharmacyInput>
  errors: FieldErrors<PharmacyInput>
  searching: boolean
  activeSource: AnnuaireSearchSource | null
  onRunSearch: (source: AnnuaireSearchSource) => void
  feedback: SiretSearchFeedback | null
  onDismissFeedback: () => void
  candidates: PharmacySiretLookup[]
  onPick: (match: PharmacySiretLookup) => void
}

function searchButton(
  searching: boolean,
  activeSource: AnnuaireSearchSource | null,
  source: AnnuaireSearchSource,
  onRunSearch: Props['onRunSearch'],
) {
  const ariaLabel = source === 'name' ? 'Rechercher par nom' : 'Rechercher par SIRET'
  const loading = searching && activeSource === source
  return <SiretSearchButton loading={loading} ariaLabel={ariaLabel} onClick={() => onRunSearch(source)} />
}

export function PharmacySiretSearchPanel(props: Props) {
  return (
    <div className="flex flex-col gap-3">
      <PharmacyLegalFields
        register={props.register}
        errors={props.errors}
        nameButton={searchButton(props.searching, props.activeSource, 'name', props.onRunSearch)}
        siretButton={searchButton(props.searching, props.activeSource, 'siret', props.onRunSearch)}
      />
      <SiretSearchAlertModal feedback={props.feedback} onClose={props.onDismissFeedback} />
      {props.candidates.length > 0 ? (
        <SiretLookupPicker matches={props.candidates} onPick={props.onPick} />
      ) : null}
    </div>
  )
}
