import { describe, it, expect, beforeEach } from 'vitest'
import { useToastStore } from '@/stores/toast-store'

describe('toast store', () => {
  beforeEach(() => useToastStore.setState({ toasts: [] }))

  it('queues a toast with variant and message', () => {
    useToastStore.getState().push({ variant: 'error', message: 'Échec enregistrement' })

    expect(useToastStore.getState().toasts).toHaveLength(1)
    expect(useToastStore.getState().toasts[0]?.message).toBe('Échec enregistrement')
    expect(useToastStore.getState().toasts[0]?.variant).toBe('error')
  })

  it('dismisses a toast by id', () => {
    useToastStore.getState().push({ variant: 'success', message: 'OK' })
    const id = useToastStore.getState().toasts[0]?.id
    useToastStore.getState().dismiss(id!)

    expect(useToastStore.getState().toasts).toHaveLength(0)
  })
})
