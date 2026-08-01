import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PharmacyTableActions } from '@/components/organisms/pharmacy-table/pharmacy-table-actions'
import { PHARMACY_QUICK_VIEW_TRIGGER } from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-copy'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'

const row: PharmacyListRow = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  city: 'Paris',
  groupementName: null,
  status: 'ACTIF',
  primaryContactName: null,
  missionCount: 0,
  softwareName: null,
}

describe('PharmacyTableActions', () => {
  it('opens quick view for the row when eye is clicked', () => {
    const onQuickView = vi.fn()
    render(<PharmacyTableActions row={row} returnPath="/pharmacies" onQuickView={onQuickView} />)

    fireEvent.click(screen.getByRole('button', { name: PHARMACY_QUICK_VIEW_TRIGGER }))

    expect(onQuickView).toHaveBeenCalledWith('p1')
  })

  it('keeps modifier link to pharmacy detail', () => {
    render(<PharmacyTableActions row={row} returnPath="/pharmacies" onQuickView={vi.fn()} />)
    expect(screen.getByRole('link', { name: 'Modifier' })).toHaveAttribute(
      'href',
      '/pharmacies/p1?back=%2Fpharmacies',
    )
  })
})
