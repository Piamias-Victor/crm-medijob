import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FacturationTable } from '@/components/organisms/facturation-table/facturation-table'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

const row: FacturationSuiviRow = {
  missionId: 'm-sent',
  pharmacyId: 'p-nord',
  pharmacyName: 'Pharma Nord',
  referentId: 'u-alice',
  referentName: 'Alice',
  contractType: 'CDD',
  commercialStatus: 'ENVOYE',
  sentAt: new Date('2026-08-05T00:00:00Z'),
  acceptedAt: null,
  amountHt: 3000,
}

describe('FacturationTable', () => {
  it('opens the Mission fiche from a row', () => {
    render(<FacturationTable rows={[row]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir la fiche' }))
    expect(push).toHaveBeenCalledWith('/missions/m-sent')
  })
})
