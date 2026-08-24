import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FinanceLineRowActions } from '@/components/molecules/FinanceLineRowActions'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'

vi.mock('@/lib/trpc/client', () => {
  const mutation = () => ({ mutate: vi.fn(), isPending: false })
  return {
    trpc: {
      useUtils: () => ({
        facturation: {
          listSuivi: { invalidate: vi.fn() },
          listLines: { invalidate: vi.fn() },
          overview: { invalidate: vi.fn() },
        },
      }),
      facturation: {
        cancelLine: { useMutation: mutation },
        restoreLine: { useMutation: mutation },
        setInvoiced: { useMutation: mutation },
        setPaid: { useMutation: mutation },
        generateDevisFromLine: { useMutation: mutation },
        sendDevisFromLine: { useMutation: mutation },
      },
    },
  }
})

const row: FacturationSuiviRow = {
  missionId: null,
  financeLineId: 'line-1',
  pharmacyId: 'p1',
  pharmacyName: 'Nord',
  referentId: null,
  referentName: null,
  contractType: 'CDD',
  commercialStatus: 'ACCEPTE',
  sentAt: null,
  acceptedAt: new Date('2026-08-22'),
  amountHt: 200,
  lineKind: 'PLACEMENT',
}

describe('FinanceLineRowActions', () => {
  it('opens a popup with the line choices from one Actions button', () => {
    render(<FinanceLineRowActions row={row} />)
    expect(screen.queryByRole('button', { name: 'Facturé' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
    expect(screen.getByRole('button', { name: 'Facturé' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Encaissé' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument()
  })
})
