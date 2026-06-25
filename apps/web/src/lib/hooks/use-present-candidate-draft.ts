'use client'

import { useEffect, useRef, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import {
  acceptPresentDraftResponse,
  buildPresentDraftKey,
} from '@/lib/present-candidate-pharmacy/present-draft-key'
import { PRESENT_DRAFT_DEBOUNCE_MS } from '@/lib/present-candidate-pharmacy/present-draft-timing'

type PresentDraft = {
  subject: string
  body: string
  to: string
  contactId: string
}

type Args = {
  candidateId: string
  pharmacyId: string
  contactId: string
}

export function usePresentCandidateDraft({ candidateId, pharmacyId, contactId }: Args) {
  const [draft, setDraft] = useState<PresentDraft | null>(null)
  const activeDraftKeyRef = useRef('')

  const { mutate, isPending, error } = trpc.candidate.presentToPharmacy.useMutation({
    onSuccess: (data, variables) => {
      const responseKey = buildPresentDraftKey(
        variables.candidateId,
        variables.pharmacyId,
        variables.contactId,
      )
      const accepted = acceptPresentDraftResponse(activeDraftKeyRef.current, responseKey, data)
      if (accepted) setDraft(accepted)
    },
  })

  useEffect(() => {
    if (!pharmacyId || !contactId) {
      setDraft(null)
      return
    }

    const key = buildPresentDraftKey(candidateId, pharmacyId, contactId)
    activeDraftKeyRef.current = key
    setDraft(null)

    const timeoutId = window.setTimeout(() => {
      mutate({ candidateId, pharmacyId, contactId })
    }, PRESENT_DRAFT_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [candidateId, pharmacyId, contactId, mutate])

  function resetDraftGeneration() {
    activeDraftKeyRef.current = ''
    setDraft(null)
  }

  return { draft, generating: isPending, error: error?.message, resetDraftGeneration }
}
