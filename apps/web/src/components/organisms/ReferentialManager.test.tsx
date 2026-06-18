import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { ReferentialManager } from '@/components/organisms/ReferentialManager'

const items = [
  { id: '1', name: 'Pharmacien' },
  { id: '2', name: 'Préparateur' },
]

function setup(overrides = {}) {
  const props = {
    title: 'Métiers',
    items,
    onAdd: vi.fn().mockResolvedValue(undefined),
    onRename: vi.fn().mockResolvedValue(undefined),
    onDelete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
  render(<ReferentialManager {...props} />)
  return props
}

describe('ReferentialManager', () => {
  it('lists existing items', () => {
    setup()
    expect(screen.getByText('Pharmacien')).toBeInTheDocument()
    expect(screen.getByText('Préparateur')).toBeInTheDocument()
  })

  it('submits a new name through onAdd', async () => {
    const props = setup()
    fireEvent.change(screen.getByLabelText('Nouveau Métiers'), {
      target: { value: 'Rayoniste' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }))
    await waitFor(() => expect(props.onAdd).toHaveBeenCalledWith('Rayoniste'))
  })

  it('does not submit a blank name', async () => {
    const props = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }))
    await waitFor(() => expect(props.onAdd).not.toHaveBeenCalled())
  })

  it('confirms before deleting an item', () => {
    const props = setup()
    fireEvent.click(screen.getAllByRole('button', { name: 'Supprimer' })[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(props.onDelete).not.toHaveBeenCalled()
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Supprimer' }))
    expect(props.onDelete).toHaveBeenCalledWith('1')
  })
})
