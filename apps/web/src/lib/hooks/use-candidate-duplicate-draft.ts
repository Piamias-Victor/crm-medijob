'use client'

import { useEffect, useState } from 'react'
import {
  readCandidateDuplicateDraft,
  type CandidateDuplicateDraft,
} from '@/lib/candidate-duplicate-draft-storage'

export function useCandidateDuplicateDraft() {
  const [draft, setDraft] = useState<CandidateDuplicateDraft | null>(null)

  useEffect(() => {
    setDraft(readCandidateDuplicateDraft())
  }, [])

  return draft
}
