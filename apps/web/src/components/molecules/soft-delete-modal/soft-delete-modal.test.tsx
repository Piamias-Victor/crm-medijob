import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SoftDeleteModal } from '@/components/molecules/soft-delete-modal/soft-delete-modal'
import { SOFT_DELETE_ERROR } from '@/components/molecules/soft-delete-modal/soft-delete-copy'
import { useToastStore } from '@/stores/toast-store'

describe('SoftDeleteModal', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('does not call onConfirm when the user cancels', () => {
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <SoftDeleteModal
        entityName="Pharmacie du Centre"
        open
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes after a successful delete', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()

    render(
      <SoftDeleteModal
        entityName="Pharmacie du Centre"
        open
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce())
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows an error toast and stays open when onConfirm fails', async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error('network'))
    const onOpenChange = vi.fn()

    render(
      <SoftDeleteModal
        entityName="Pharmacie du Centre"
        open
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {
      expect(useToastStore.getState().toasts[0]?.message).toBe(SOFT_DELETE_ERROR)
    })
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })
})
