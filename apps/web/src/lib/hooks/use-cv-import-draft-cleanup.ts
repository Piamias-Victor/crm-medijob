'use client'

import { useEffect } from 'react'
import { trpc } from '@/lib/trpc/client'
import {
  clearCvImportDraft,
  readCvImportDraft,
  revokeCvImportPreview,
} from '@/lib/cv-import-draft-storage'

export function useCvImportDraftCleanup() {
  const discard = trpc.candidate.discardCvDraft.useMutation()

  useEffect(() => {
    return () => {
      const draft = readCvImportDraft()
      if (!draft) return
      discard.mutate({ cvUrl: draft.cvUrl })
      revokeCvImportPreview(draft.previewUrl)
      clearCvImportDraft()
    }
  }, [discard])
}
