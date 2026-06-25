'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { usePresentCandidateRadiusDraft } from '@/lib/hooks/use-present-candidate-radius-draft'
import { buildRadiusBcc } from '@/lib/present-candidate-radius/build-radius-bcc'
import { syncRadiusPharmacySelection } from '@/lib/present-candidate-radius/sync-radius-pharmacy-selection'

const RADIUS_DEBOUNCE_MS = 400

export function usePresentCandidateRadius(candidateId: string, defaultRadiusKm: number) {
  const [radiusInput, setRadiusInput] = useState(defaultRadiusKm)
  const [radiusKm, setRadiusKm] = useState(defaultRadiusKm)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const previousSelectionRef = useRef<string[]>([])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setRadiusKm(radiusInput), RADIUS_DEBOUNCE_MS)
    return () => window.clearTimeout(timeoutId)
  }, [radiusInput])

  const list = trpc.candidate.listPharmaciesInRadius.useQuery(
    { candidateId, radiusKm },
    { enabled: radiusKm > 0, staleTime: 30_000 },
  )

  const pharmacies = list.data?.pharmacies ?? []
  const pharmacyListKey = pharmacies.map((row) => row.id).join(',')

  useEffect(() => {
    if (!pharmacyListKey) return
    const nextIds = pharmacyListKey.split(',')
    setSelectedIds((current) => {
      const synced = syncRadiusPharmacySelection(
        previousSelectionRef.current.length > 0 ? previousSelectionRef.current : current,
        nextIds,
      )
      previousSelectionRef.current = synced
      return synced
    })
  }, [pharmacyListKey])

  const draftFlow = usePresentCandidateRadiusDraft({
    candidateId,
    enabled: pharmacies.length > 0,
  })

  const bcc = useMemo(() => buildRadiusBcc(pharmacies, selectedIds), [pharmacies, selectedIds])

  function togglePharmacy(pharmacyId: string) {
    setSelectedIds((current) => {
      const next = current.includes(pharmacyId)
        ? current.filter((id) => id !== pharmacyId)
        : [...current, pharmacyId]
      previousSelectionRef.current = next
      return next
    })
  }

  return {
    radiusInput,
    setRadiusInput,
    centerLabel: list.data?.centerLabel ?? '',
    pharmacies,
    listLoading: list.isFetching,
    listError: list.error?.message,
    selectedIds,
    togglePharmacy,
    bcc,
    draft: draftFlow.draft,
    generating: draftFlow.generating,
    draftError: draftFlow.error,
    retryDraft: draftFlow.retry,
  }
}
