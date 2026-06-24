import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ToastViewport } from '@/components/molecules/ToastViewport'
import { useToastStore } from '@/stores/toast-store'

describe('ToastViewport', () => {
  beforeEach(() => useToastStore.setState({ toasts: [] }))

  it('renders above modals via portal and elevated z-index', () => {
    useToastStore.getState().push({ variant: 'error', message: 'Échec' })
    render(<ToastViewport />)

    const viewport = screen.getByText('Échec').closest('[aria-live="polite"]')
    expect(viewport).toHaveClass('z-[100]')
    expect(viewport?.parentElement).toBe(document.body)
  })
})
