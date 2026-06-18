import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ContactInfoForm } from '@/components/molecules/ContactInfoForm'
import type { ContactDetail } from '@/server/routers/contact'

const contact = {
  id: 'c1',
  pharmacyId: 'p1',
  firstName: 'Marie',
  lastName: 'Curie',
  email: 'marie@example.com',
  phone: '0102030405',
  role: 'TITULAIRE',
  isPrimary: true,
  notes: null,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  pharmacy: { id: 'p1', name: 'Pharmacie du Centre' },
} satisfies ContactDetail

describe('ContactInfoForm', () => {
  it('renders editable fields with current contact values', () => {
    render(
      <ContactInfoForm
        contact={contact}
        pharmacies={[{ id: 'p1', name: 'Pharmacie du Centre' }]}
        submitting={false}
        onSubmit={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Prénom')).toHaveValue('Marie')
    expect(screen.getByLabelText('Nom')).toHaveValue('Curie')
    expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument()
  })
})
