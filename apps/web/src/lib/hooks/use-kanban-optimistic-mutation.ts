'use client'

import { useCallback } from 'react'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

type MutationError = { message: string }

type Options<T, TVars> = {
  rows: T[]
  setRows: (value: T[] | ((prev: T[]) => T[])) => void
  applyOptimistic: (prev: T[], vars: TVars) => T[]
  mutate: (vars: TVars, handlers: { onError: (error: MutationError) => void }) => void
}

export function useKanbanOptimisticMutation<T, TVars>({
  rows,
  setRows,
  applyOptimistic,
  mutate,
}: Options<T, TVars>) {
  const toast = useEntityMutation()

  return useCallback(
    (vars: TVars) => {
      const snapshot = rows
      setRows((prev) => applyOptimistic(prev, vars))
      mutate(vars, {
        onError: (error) => {
          toast.onError(error)
          setRows(snapshot)
        },
      })
    },
    [rows, setRows, applyOptimistic, mutate, toast],
  )
}
