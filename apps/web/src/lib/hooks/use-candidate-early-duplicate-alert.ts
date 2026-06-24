'use client'

import { useEffect, useRef, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { useToastStore } from '@/stores/toast-store'
import { DUPLICATE_PROBE_ERROR } from '@/lib/candidate-duplicate-copy'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'
import {
  isDuplicateProbeReady,
  toDetectDuplicateInput,
  type DuplicateProbe,
} from '@/lib/candidate-duplicate-probe'

type Options = {
  checkOnMount?: boolean
  enabled?: boolean
}

export function useCandidateEarlyDuplicateAlert(probe: DuplicateProbe, options: Options = {}) {
  const enabled = options.enabled ?? true
  const utils = trpc.useUtils()
  const push = useToastStore((s) => s.push)
  const [matches, setMatches] = useState<DuplicateMatch[]>([])
  const [open, setOpen] = useState(false)
  const dismissedKeyRef = useRef<string | null>(null)
  const lastCheckedKeyRef = useRef('')

  useEffect(() => {
    if (!enabled || !isDuplicateProbeReady(probe)) return

    const key = JSON.stringify(toDetectDuplicateInput(probe))
    if (dismissedKeyRef.current === key) return
    if (!options.checkOnMount && key === lastCheckedKeyRef.current) return

    const timeout = window.setTimeout(async () => {
      try {
        const result = await utils.candidate.detectDuplicate.fetch(toDetectDuplicateInput(probe))
        lastCheckedKeyRef.current = key
        if (!result.length) {
          setMatches([])
          return
        }
        setMatches(result)
        setOpen(true)
      } catch {
        setMatches([])
        push({ variant: 'error', message: DUPLICATE_PROBE_ERROR })
      }
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [probe.firstName, probe.lastName, probe.email, probe.phone, options.checkOnMount, enabled, utils, push])

  function dismiss() {
    dismissedKeyRef.current = JSON.stringify(toDetectDuplicateInput(probe))
    setOpen(false)
  }

  function isDismissedForCurrentProbe() {
    return dismissedKeyRef.current === JSON.stringify(toDetectDuplicateInput(probe))
  }

  function reopenIfNeeded() {
    if (matches.length && !isDismissedForCurrentProbe()) setOpen(true)
  }

  return { matches, open, dismiss, reopenIfNeeded, isDismissedForCurrentProbe }
}
