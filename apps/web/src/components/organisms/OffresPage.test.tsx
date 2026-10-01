import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { OffresPage } from '@/components/organisms/OffresPage'
import { CREATE_OFFER_LABEL } from '@/view-models/mission-offer-picker'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/offres',
  useSearchParams: () => new URLSearchParams(),
}))

const emptyQuery = { data: undefined, isLoading: false }

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    mission: {
      list: { useQuery: () => ({ data: { rows: [] } }) },
      referentials: { useQuery: () => ({ data: { jobTitles: [] } }) },
      mapPins: { useQuery: () => emptyQuery },
    },
    pharmacy: { mapPins: { useQuery: () => emptyQuery } },
    candidate: { mapPins: { useQuery: () => emptyQuery } },
    jobOffer: {
      publish: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      unpublish: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      softDelete: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      createStandalone: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      mapPins: { useQuery: () => emptyQuery },
    },
  },
}))

vi.mock('@/lib/hooks/use-can', () => ({ useCan: () => false }))
vi.mock('@/lib/hooks/use-entity-mutation', () => ({
  useEntityMutation: () => ({ onSuccess: vi.fn() }),
}))
vi.mock('@/components/molecules/EntityMap', () => ({
  EntityMap: () => <div data-testid="entity-map" />,
}))

describe('OffresPage', () => {
  it('shows create action and Liste/Carte toggle', async () => {
    render(<OffresPage initialRows={[]} />)
    expect(screen.getByRole('button', { name: CREATE_OFFER_LABEL })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Liste' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Carte' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Toutes' })).toBeInTheDocument()
    })
  })
})
