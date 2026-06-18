import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserRoleSelect } from '@/components/molecules/UserRoleSelect'

describe('UserRoleSelect', () => {
  it('shows the selected role label in the combobox', () => {
    render(<UserRoleSelect value="RECRUTEUR" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /recruteur/i })).toBeInTheDocument()
  })

  it('notifies parent when a role is picked', () => {
    const onChange = vi.fn()
    render(<UserRoleSelect value="RECRUTEUR" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /recruteur/i }))
    fireEvent.click(screen.getByRole('option', { name: 'Administrateur' }))
    expect(onChange).toHaveBeenCalledWith('ADMIN')
  })
})
