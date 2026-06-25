'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import {
  acceptPresentRadiusDraftResponse,
  buildPresentRadiusDraftKey,
} from '@/lib/present-candidate-radius/present-radius-draft-key'
import { PRESENT_DRAFT_DEBOUNCE_MS } from '@/lib/present-candidate-radius/present-radius-draft-timing'

type PresentRadiusDraft = {
  subject: string
  body: string
}

type Args = {
  candidateId: string
  enabled: boolean
}

export function usePresentCandidateRadiusDraft({ candidateId, enabled }: Args) {
  const [draft, setDraft] = useState<PresentRadiusDraft | null>(null)
  const activeDraftKeyRef = useRef('')
  const requestedRef = useRef(false)

  const { mutate, isPending, error, reset } = trpc.candidate.presentInRadius.useMutation({
    onSuccess: (data, variables) => {
      requestedRef.current = true
      const responseKey = buildPresentRadiusDraftKey(variables.candidateId)
      const accepted = acceptPresentRadiusDraftResponse(activeDraftKeyRef.current, responseKey, data)
      if (accepted) setDraft(accepted)
    },
    onError: () => {
      requestedRef.current = false
    },
  })

  const requestDraft = useCallback(() => {
    if (!enabled) return
    const key = buildPresentRadiusDraftKey(candidateId)
    activeDraftKeyRef.current = key
    mutate({ candidateId })
  }, [candidateId, enabled, mutate])

  const retry = useCallback(() => {
    requestedRef.current = false
    reset()
    setDraft(null)
    requestDraft()
  }, [requestDraft, reset])

  useEffect(() => {
    if (!enabled || requestedRef.current) return

    const timeoutId = window.setTimeout(requestDraft, PRESENT_DRAFT_DEBOUNCE_MS)
    return () => window.clearTimeout(timeoutId)
  }, [enabled, requestDraft])

  return { draft, generating: isPending, error: error?.message, retry }
}
