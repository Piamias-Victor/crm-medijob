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
  const lastSaved = useRef<string | null>(parsed ? serializeAnonymizedDossier(parsed) : null)
  const debounced = useDebouncedValue(draft, ANONYMIZED_DOSSIER_AUTOSAVE_MS)
  const save = trpc.candidate.saveAnonymized.useMutation()

  useEffect(() => {
    const next = parseAnonymizedDossier(stored)
    if (!next) return
    setDraft(next)
    lastSaved.current = serializeAnonymizedDossier(next)
  }, [stored])

  const persist = (dossier: AnonymizedDossier) => {
    if (lastSaved.current === null) return
    const json = serializeAnonymizedDossier(dossier)
    if (json === lastSaved.current || save.isPending) return
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
    // intentionally only when debounced draft changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return {
    draft,
    setSection: (key: keyof AnonymizedDossier, value: string) =>
      setDraft((prev) => ({ ...prev, [key]: value })),
    flush: () => persist(draft),
    replace: (dossier: AnonymizedDossier, raw: string) => {
      setDraft(dossier)
      lastSaved.current = raw
    },
    saving: save.isPending,
  }
}
