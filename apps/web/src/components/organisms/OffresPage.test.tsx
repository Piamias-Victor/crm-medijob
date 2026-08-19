import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OffresPage } from '@/components/organisms/OffresPage'
import { CREATE_OFFER_LABEL } from '@/view-models/mission-offer-picker'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    mission: { list: { useQuery: () => ({ data: { rows: [] } }) } },
    jobOffer: {
      publish: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      unpublish: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      softDelete: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}))

vi.mock('@/lib/hooks/use-can', () => ({ useCan: () => false }))

describe('OffresPage', () => {
  it('shows a create offer action', () => {
    render(<OffresPage initialRows={[]} />)
    expect(screen.getByRole('button', { name: CREATE_OFFER_LABEL })).toBeInTheDocument()
  })
})
