import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CandidateDocumentsTabContainer } from '@/components/organisms/CandidateDocumentsTabContainer'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'

vi.mock('@/components/organisms/CandidateDocumentsTab', () => ({
  CandidateDocumentsTab: ({ documents }: { documents: { id: string }[] }) => (
    <div data-testid="docs-tab">{documents.map((d) => d.id).join(',')}</div>
  ),
}))

const listByEntity = vi.fn()

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    document: {
      listByEntity: { useQuery: (input: unknown) => listByEntity(input) },
    },
  },
}))

const profile = { id: 'c1' } as CandidateProfilePayload

describe('CandidateDocumentsTabContainer', () => {
  it('shows loading while documents query is pending', () => {
    listByEntity.mockReturnValue({ data: undefined, isLoading: true })
    render(<CandidateDocumentsTabContainer profile={profile} />)
    expect(screen.getByText('Chargement…')).toBeInTheDocument()
    expect(listByEntity).toHaveBeenCalledWith({ entityType: 'CANDIDATE', entityId: 'c1' })
  })

  it('renders documents when query resolves', () => {
    listByEntity.mockReturnValue({
      data: [{ id: 'd1' }, { id: 'd2' }],
      isLoading: false,
    })
    render(<CandidateDocumentsTabContainer profile={profile} />)
    expect(screen.getByTestId('docs-tab')).toHaveTextContent('d1,d2')
  })
})
