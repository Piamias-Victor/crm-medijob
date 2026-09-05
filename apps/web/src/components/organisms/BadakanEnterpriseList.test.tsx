import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadakanEnterpriseList } from './BadakanEnterpriseList'
import type { BadakanEnterpriseListItem } from '@/view-models/badakan-enterprise-list'

const row: BadakanEnterpriseListItem = {
  id: 'row1',
  name: 'Pharmacie Hermes',
  siretLabel: '12345678901234',
  cityLabel: 'Paris',
  href: '/interim/officines/row1',
}

describe('BadakanEnterpriseList', () => {
  it('shows pending enterprises waiting for Pharmacy verification', () => {
    render(<BadakanEnterpriseList rows={[row]} />)
    expect(screen.getByText('Pharmacie Hermes')).toBeInTheDocument()
    expect(screen.getByText('12345678901234')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/interim/officines/row1')
  })

  it('explains an empty verification queue', () => {
    render(<BadakanEnterpriseList rows={[]} />)
    expect(screen.getByText('Aucune officine à vérifier')).toBeInTheDocument()
  })
})
