import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKanbanOptimisticMutation } from '@/lib/hooks/use-kanban-optimistic-mutation'
import { useToastStore } from '@/stores/toast-store'

type Row = { id: string; status: string }

describe('useKanbanOptimisticMutation', () => {
  beforeEach(() => useToastStore.setState({ toasts: [] }))

  it('rolls back rows and shows a toast when the mutation fails', () => {
    const mutate = vi.fn((_vars: unknown, handlers: { onError: (error: { message: string }) => void }) => {
      handlers.onError({ message: 'Erreur réseau' })
    })
    let rows: Row[] = [{ id: '1', status: 'A' }]
    const setRows = vi.fn((value: Row[] | ((prev: Row[]) => Row[])) => {
      rows = typeof value === 'function' ? value(rows) : value
    })

    const { result } = renderHook(() =>
      useKanbanOptimisticMutation({
        rows,
        setRows,
        applyOptimistic: (prev) => prev.map((row) => ({ ...row, status: 'B' })),
        mutate,
      }),
    )

    act(() => result.current({ id: '1' }))

    expect(setRows).toHaveBeenCalled()
    expect(setRows).toHaveBeenLastCalledWith([{ id: '1', status: 'A' }])
    expect(useToastStore.getState().toasts[0]?.message).toBe('Erreur réseau')
  })
})
