import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PharmacyTableActions } from '@/components/organisms/pharmacy-table/pharmacy-table-actions'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'

const row: PharmacyListRow = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  city: 'Paris',
  postalCode: '75001',
  latitude: null,
  longitude: null,
  createdAtLabel: '15/03/2026',
  groupementName: null,
  status: 'ACTIF',
  primaryContactName: null,
  missionCount: 0,
  softwareName: null,
  referentName: null,
}

describe('PharmacyTableActions', () => {
  it('links to pharmacy detail without quick-view aperçu', () => {
    render(<PharmacyTableActions row={row} returnPath="/pharmacies" />)
    expect(screen.queryByRole('button', { name: 'Vue rapide' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Modifier' })).toHaveAttribute(
      'href',
      '/pharmacies/p1?back=%2Fpharmacies',
    )
  })
})
