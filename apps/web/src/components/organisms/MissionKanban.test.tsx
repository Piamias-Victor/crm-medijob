import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MissionKanban } from '@/components/organisms/MissionKanban'
import { mission } from '@/view-models/mission-kanban.fixtures'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    mission: {
      updateStatus: {
        useMutation: () => ({ mutate: vi.fn(), isPending: false }),
      },
    },
  },
}))

describe('MissionKanban', () => {
  it('shows empty state when every mission is terminal', () => {
    render(
      <MissionKanban
        missions={[mission({ id: 'm1', status: 'POURVU' }), mission({ id: 'm2', status: 'ANNULEE' })]}
      />,
    )

    expect(screen.getByText('Aucune mission active')).toBeInTheDocument()
  })
})
