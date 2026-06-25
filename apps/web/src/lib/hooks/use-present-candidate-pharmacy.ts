'use client'

import { useEffect, useMemo, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { usePresentCandidateDraft } from '@/lib/hooks/use-present-candidate-draft'
import { buildPharmacyPickerOptions } from '@/lib/present-candidate-pharmacy/pharmacy-picker-options'
import { defaultContactPharmacyPickerId } from '@/view-models/contact-pharmacy-picker'

const MIN_PHARMACY_SEARCH_LENGTH = 2

export function usePresentCandidatePharmacy(candidateId: string) {
  const [pharmacyId, setPharmacyId] = useState('')
  const [pharmacyLabel, setPharmacyLabel] = useState('')
  const [pharmacySearchTerm, setPharmacySearchTerm] = useState('')
  const [contactId, setContactId] = useState('')

  const pharmacySearch = trpc.assistant.searchEntities.useQuery(
    { entityType: 'pharmacy', term: pharmacySearchTerm },
    { enabled: pharmacySearchTerm.trim().length >= MIN_PHARMACY_SEARCH_LENGTH, staleTime: 30_000 },
  )
  const contacts = trpc.contact.listByPharmacy.useQuery(
    { pharmacyId },
    { enabled: Boolean(pharmacyId) },
  )
  const draftFlow = usePresentCandidateDraft({ candidateId, pharmacyId, contactId })

  useEffect(() => {
    if (!pharmacyId || contacts.isLoading) return
    const rows = contacts.data ?? []
    setContactId((current) => {
      if (current && rows.some((row) => row.id === current)) return current
      return defaultContactPharmacyPickerId(rows) ?? ''
    })
  }, [pharmacyId, contacts.data, contacts.isLoading])

  function selectPharmacy(nextPharmacyId: string, label: string) {
    draftFlow.resetDraftGeneration()
    setPharmacyId(nextPharmacyId)
    setPharmacyLabel(label)
    setContactId('')
  }

  function selectContact(nextContactId: string) {
    draftFlow.resetDraftGeneration()
    setContactId(nextContactId)
  }

  const pharmacyOptions = useMemo(
    () => buildPharmacyPickerOptions(pharmacySearch.data ?? [], pharmacyId, pharmacyLabel),
    [pharmacySearch.data, pharmacyId, pharmacyLabel],
  )

  const contactOptions = useMemo(
    () =>
      (contacts.data ?? []).map((row) => ({
        value: row.id,
        label: row.isPrimary ? `${row.label} · principal` : row.label,
      })),
    [contacts.data],
  )

  return {
    pharmacyId,
    selectPharmacy,
    setPharmacySearchTerm,
    pharmacySearchLoading: pharmacySearch.isFetching,
    contactId,
    selectContact,
    pharmacyOptions,
    contactOptions,
    contactsLoading: contacts.isLoading,
    noEmailContacts: Boolean(pharmacyId) && !contacts.isLoading && contactOptions.length === 0,
    draft: draftFlow.draft,
    generating: draftFlow.generating,
    error: draftFlow.error,
  }
}
