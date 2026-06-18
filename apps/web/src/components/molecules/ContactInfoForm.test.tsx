import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ContactInfoForm } from '@/components/molecules/ContactInfoForm'
import type { ContactDetailPayload } from '@/view-models/contact-detail.types'

const contact: ContactDetailPayload = {
  id: 'c1',
  fullName: 'Marie Curie',
  pharmacyId: 'p1',
  firstName: 'Marie',
  lastName: 'Curie',
  email: 'marie@example.com',
  phone: '0102030405',
  role: 'TITULAIRE',
  isPrimary: true,
  notes: null,
  updatedAt: new Date(),
  pharmacyName: 'Pharmacie du Centre',
  pharmacy: { id: 'p1', name: 'Pharmacie du Centre' },
}

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
