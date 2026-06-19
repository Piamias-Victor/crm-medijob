'use client'

import { useCallback, useMemo } from 'react'
import { useToastStore } from '@/stores/toast-store'

type MutationError = { message: string }

type Options = {
  successMessage?: string
  onSuccess?: () => void
  onError?: (error: MutationError) => void
}

export function useEntityMutation(options: Options = {}) {
  const push = useToastStore((s) => s.push)

  const onSuccess = useCallback(() => {
    if (options.successMessage) push({ variant: 'success', message: options.successMessage })
    options.onSuccess?.()
  }, [options, push])

  const onError = useCallback(
    (error: MutationError) => {
      push({ variant: 'error', message: error.message })
      options.onError?.(error)
    },
    [options, push],
  )

  return useMemo(() => ({ onSuccess, onError }), [onSuccess, onError])
}
