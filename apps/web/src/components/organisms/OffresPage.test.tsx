import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { OffresPage } from '@/components/organisms/OffresPage'
import { CREATE_OFFER_LABEL } from '@/view-models/mission-offer-picker'
import { buildJobOfferFilterConfig } from '@/lib/filters/job-offer-filter-config'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/offres',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/hooks/use-job-offer-list-query', () => ({
  useJobOfferListQuery: () => ({
    values: buildDefaultFilterValues(buildJobOfferFilterConfig([], [], [])),
    setFilters: vi.fn(),
    reset: vi.fn(),
    rows: [],
  }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    mission: {
      list: { useQuery: () => ({ data: { rows: [] } }) },
      referentials: { useQuery: () => ({ data: { jobTitles: [] } }) },
    },
    jobOffer: {
      createStandalone: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}))

vi.mock('@/lib/hooks/use-entity-mutation', () => ({
  useEntityMutation: () => ({ onSuccess: vi.fn(), onError: vi.fn() }),
}))

vi.mock('@/components/molecules/EntityMap', () => ({
  EntityMap: () => <div data-testid="entity-map" />,
}))

vi.mock('@/components/organisms/EntityMapWithLayers', () => ({
  EntityMapWithLayers: () => <div data-testid="entity-map" />,
}))

const filterConfig = buildJobOfferFilterConfig([], [], [])

describe('OffresPage', () => {
  it('shows create, filters, and Liste/Carte toggle', async () => {
    render(
      <OffresPage initialRows={[]} serverFilters={{}} filterConfig={filterConfig} />,
    )
    expect(screen.getByRole('button', { name: CREATE_OFFER_LABEL })).toBeInTheDocument()
    expect(screen.getByText('Type de contrat')).toBeInTheDocument()
    expect(screen.getByText('Statut')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Carte' }))
    await waitFor(() => {
      expect(screen.getByTestId('entity-map')).toBeInTheDocument()
    })
  })
})
