import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { useToastStore } from '@/stores/toast-store'

describe('useEntityMutation', () => {
  beforeEach(() => useToastStore.setState({ toasts: [] }))

  it('shows error toast on mutation failure', () => {
    const { result } = renderHook(() => useEntityMutation())

    act(() => result.current.onError({ message: 'Champ invalide' }))

    expect(useToastStore.getState().toasts[0]?.variant).toBe('error')
    expect(useToastStore.getState().toasts[0]?.message).toBe('Champ invalide')
  })

  it('shows success toast and runs callback on success', () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() =>
      useEntityMutation({ successMessage: 'Enregistré', onSuccess }),
    )

    act(() => result.current.onSuccess())

    expect(onSuccess).toHaveBeenCalledOnce()
    expect(useToastStore.getState().toasts[0]?.variant).toBe('success')
  })
})
