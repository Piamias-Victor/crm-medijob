'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { FormField } from '@/components/molecules/FormField'
import { Spinner } from '@/components/atoms/Spinner'
import { PRESENT_CANDIDATE_PHARMACY_SEARCH_PLACEHOLDER } from '@/lib/constants/present-candidate-pharmacy-copy'

type Option = { value: string; label: string }

type Props = {
  pharmacyId: string
  contactId: string
  pharmacyOptions: Option[]
  contactOptions: Option[]
  pharmacySearchLoading: boolean
  contactsLoading: boolean
  noEmailContacts: boolean
  onPharmacySearch: (query: string) => void
  onPharmacyChange: (pharmacyId: string, label: string) => void
  onContactChange: (value: string) => void
}

export function PresentCandidatePharmacyPickers({
  pharmacyId,
  contactId,
  pharmacyOptions,
  contactOptions,
  pharmacySearchLoading,
  contactsLoading,
  noEmailContacts,
  onPharmacySearch,
  onPharmacyChange,
  onContactChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField label="Pharmacie">
        <Combobox
          value={pharmacyId}
          onChange={(value) => {
            const label = pharmacyOptions.find((option) => option.value === value)?.label ?? value
            onPharmacyChange(value, label)
          }}
          options={pharmacyOptions}
          placeholder={PRESENT_CANDIDATE_PHARMACY_SEARCH_PLACEHOLDER}
          remoteSearch
          onQueryChange={onPharmacySearch}
        />
        {pharmacySearchLoading ? (
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <Spinner className="size-3 border-fg-muted/40 border-t-fg-muted" />
            Recherche…
          </div>
        ) : null}
      </FormField>
      <FormField label="Contact destinataire">
        <Combobox
          value={contactId}
          onChange={onContactChange}
          options={contactOptions}
          placeholder={contactsLoading ? 'Chargement…' : 'Sélectionner un contact'}
        />
        {noEmailContacts ? (
          <p className="text-xs text-error">Aucun contact avec email pour cette pharmacie.</p>
        ) : null}
        {contactsLoading ? (
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <Spinner className="size-3 border-fg-muted/40 border-t-fg-muted" />
            Contacts…
          </div>
        ) : null}
      </FormField>
    </div>
  )
}
