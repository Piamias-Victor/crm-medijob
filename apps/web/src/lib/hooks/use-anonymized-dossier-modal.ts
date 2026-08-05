'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { candidateAnonymizedPdfPath } from '@/lib/candidate-anonymized-pdf-url'
import { ANONYMIZED_REGENERATE_CONFIRM } from '@/lib/constants/anonymized-dossier'
import {
  emptyAnonymizedDossier,
  parseAnonymizedDossier,
  type AnonymizedDossier,
} from '@/view-models/anonymized-dossier'

type Args = {
  candidateId: string
  stored: string | null | undefined
}

export function useAnonymizedDossierModal({ candidateId, stored }: Args) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<AnonymizedDossier | null>(null)
  const [error, setError] = useState<string>()

  const generate = trpc.candidate.generateAnonymized.useMutation({
    onSuccess: (data) => {
      setDraft(parseAnonymizedDossier(data.anonymizedProfile) ?? emptyAnonymizedDossier())
      setError(undefined)
    },
    onError: (err) => setError(err.message),
  })

  const save = trpc.candidate.saveAnonymized.useMutation({
    onSuccess: () => {
      router.refresh()
      window.open(candidateAnonymizedPdfPath(candidateId), '_blank', 'noopener,noreferrer')
      setOpen(false)
    },
    onError: (err) => setError(err.message),
  })

  const runGenerate = useCallback(() => {
    setDraft(null)
    setError(undefined)
    generate.mutate({ id: candidateId })
  }, [candidateId, generate.mutate])

  const openModal = useCallback(() => {
    setOpen(true)
    setError(undefined)
    const existing = parseAnonymizedDossier(stored)
    if (existing) {
      setDraft(existing)
      return
    }
    runGenerate()
  }, [stored, runGenerate])

  const regenerate = useCallback(() => {
    if (draft && !window.confirm(ANONYMIZED_REGENERATE_CONFIRM)) return
    runGenerate()
  }, [draft, runGenerate])

  const close = useCallback(() => {
    if (generate.isPending || save.isPending) return
    setOpen(false)
    setDraft(null)
    setError(undefined)
  }, [generate.isPending, save.isPending])

  return {
    open,
    draft,
    error,
    generating: generate.isPending,
    saving: save.isPending,
    openModal,
    close,
    setSection: (key: keyof AnonymizedDossier, value: string) => {
      setDraft((prev) => (prev ? { ...prev, [key]: value } : prev))
    },
    confirmPdf: () => {
      if (!draft) return
      setError(undefined)
      save.mutate({ id: candidateId, dossier: draft })
    },
    regenerate,
  }
}
