'use client'

import { useRouter } from 'next/navigation'
import { useCandidateEarlyDuplicateAlert } from '@/lib/hooks/use-candidate-early-duplicate-alert'
import type { DuplicateProbe } from '@/lib/candidate-duplicate-probe'

type Options = {
  checkOnMount?: boolean
  enabled?: boolean
}

export function useCandidateCreateDuplicateAlert(probe: DuplicateProbe, options: Options = {}) {
  const router = useRouter()
  const alert = useCandidateEarlyDuplicateAlert(probe, options)

  function guardSubmit<T>(submit: (data: T) => void) {
    return (data: T) => {
      if (alert.matches.length && !alert.isDismissedForCurrentProbe()) {
        alert.reopenIfNeeded()
        return
      }
      submit(data)
    }
  }

  return {
    alertProps: {
      open: alert.open,
      matches: alert.matches,
      onContinue: alert.dismiss,
      onClose: alert.dismiss,
      onEdit: (candidateId: string) => router.push(`/candidats/${candidateId}`),
    },
    guardSubmit,
  }
}
