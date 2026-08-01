'use client'

import { useSyncExternalStore } from 'react'
import {
  clearPharmacyDuplicateDraft,
  readPharmacyDuplicateDraft,
  type PharmacyDuplicateDraft,
} from '@/lib/pharmacy-duplicate-draft-storage'

function subscribe() {
  return () => undefined
}

export function usePharmacyDuplicateDraft(): PharmacyDuplicateDraft | null {
  return useSyncExternalStore(
    subscribe,
    () => readPharmacyDuplicateDraft(),
    () => null,
  )
}

export function useClearPharmacyDuplicateDraft() {
  return clearPharmacyDuplicateDraft
}
