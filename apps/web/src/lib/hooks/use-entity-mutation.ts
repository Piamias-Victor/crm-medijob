'use client'

import { useCallback, useMemo } from 'react'
import { useToastStore } from '@/stores/toast-store'

type MutationError = { message: string }

type Options<TData = unknown> = {
  successMessage?: string
  onSuccess?: (data?: TData) => void
  onError?: (error: MutationError) => void
}

export function useEntityMutation<TData = unknown>(options: Options<TData> = {}) {
  const push = useToastStore((s) => s.push)

  const onSuccess = useCallback(
    (data?: TData) => {
      if (options.successMessage) push({ variant: 'success', message: options.successMessage })
      options.onSuccess?.(data)
    },
    [options, push],
  )

  const onError = useCallback(
    (error: MutationError) => {
      push({ variant: 'error', message: error.message })
      options.onError?.(error)
    },
    [options, push],
  )

  return useMemo(() => ({ onSuccess, onError }), [onSuccess, onError])
}
