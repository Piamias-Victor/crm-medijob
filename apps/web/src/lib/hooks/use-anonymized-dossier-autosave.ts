'use client'

import { useEffect, useRef, useState } from 'react'
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value'
import { ANONYMIZED_DOSSIER_AUTOSAVE_MS } from '@/lib/constants/anonymized-dossier'
import { trpc } from '@/lib/trpc/client'
import {
  emptyAnonymizedDossier,
  parseAnonymizedDossier,
  serializeAnonymizedDossier,
  type AnonymizedDossier,
} from '@/view-models/anonymized-dossier'

type Args = {
  candidateId: string
  stored: string | null | undefined
  onError: (message: string) => void
  onSaved: () => void
}

export function useAnonymizedDossierAutosave({ candidateId, stored, onError, onSaved }: Args) {
  const parsed = parseAnonymizedDossier(stored)
  const [draft, setDraft] = useState<AnonymizedDossier>(parsed ?? emptyAnonymizedDossier())
  const lastSaved = useRef(serializeAnonymizedDossier(parsed ?? emptyAnonymizedDossier()))
  const debounced = useDebouncedValue(draft, ANONYMIZED_DOSSIER_AUTOSAVE_MS)
  const save = trpc.candidate.saveAnonymized.useMutation()

  useEffect(() => {
    const next = parseAnonymizedDossier(stored) ?? emptyAnonymizedDossier()
    setDraft(next)
    lastSaved.current = serializeAnonymizedDossier(next)
  }, [stored])

  const persist = (dossier: AnonymizedDossier) => {
    const json = serializeAnonymizedDossier(dossier)
    if (json === lastSaved.current || save.isPending) return
    const hasContent = Object.values(dossier).some((value) => value.trim())
    if (!hasContent && !parseAnonymizedDossier(stored)) return
    save.mutate(
      { id: candidateId, dossier },
      {
        onSuccess: (data) => {
          lastSaved.current = data.anonymizedProfile
          onSaved()
        },
        onError: (error) => onError(error.message),
      },
    )
  }

  useEffect(() => {
    persist(debounced)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce trigger only
  }, [debounced])

  return {
    draft,
    setSection: (key: keyof AnonymizedDossier, value: string) =>
      setDraft((prev) => ({ ...prev, [key]: value })),
    flush: () => persist(draft),
    saving: save.isPending,
  }
}
