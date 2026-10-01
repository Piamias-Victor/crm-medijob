import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { OffresPage } from '@/components/organisms/OffresPage'
import { CREATE_OFFER_LABEL } from '@/view-models/mission-offer-picker'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    mission: {
      list: { useQuery: () => ({ data: { rows: [] } }) },
      referentials: { useQuery: () => ({ data: { jobTitles: [] } }) },
    },
    jobOffer: {
      publish: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      unpublish: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      softDelete: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      createStandalone: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}))

vi.mock('@/lib/hooks/use-can', () => ({ useCan: () => false }))
vi.mock('@/lib/hooks/use-entity-mutation', () => ({
  useEntityMutation: () => ({ onSuccess: vi.fn() }),
}))

describe('OffresPage', () => {
  it('shows create action and Liste/Carte toggle', () => {
    render(<OffresPage initialRows={[]} />)
    expect(screen.getByRole('button', { name: CREATE_OFFER_LABEL })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Liste' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Carte' }))
    expect(screen.getByRole('button', { name: 'Toutes' })).toBeInTheDocument()
  })
})
