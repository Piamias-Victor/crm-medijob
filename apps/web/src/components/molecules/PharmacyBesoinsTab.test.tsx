import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PharmacyBesoinsTab } from '@/components/molecules/PharmacyBesoinsTab'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
}))

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { id: 'u1' } } }),
}))

const mission = {
  id: 'm1',
  title: 'Titulaire CDI',
  jobTitle: 'Pharmacien',
  contractType: 'CDI' as const,
  status: 'A_POURVOIR' as const,
  startDate: new Date('2026-03-01'),
  updatedAt: new Date('2026-03-01'),
  referent: 'Réf Demo',
}

describe('PharmacyBesoinsTab', () => {
  it('navigates to the mission detail when a row is clicked', () => {
    render(
      <PharmacyBesoinsTab
        pharmacyId="p1"
        missions={[mission]}
        jobTitles={[]}
        recruiters={[]}
        submitting={false}
        onCreate={() => {}}
        onCreateJobTitle={async (name) => ({ id: 'jt', name })}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /titulaire cdi/i }))

    expect(push).toHaveBeenCalledWith('/missions/m1')
  })

  it('shows contract type badge on each besoin row', () => {
    render(
      <PharmacyBesoinsTab
        pharmacyId="p1"
        missions={[{ ...mission, contractType: 'INTERIM', title: 'Remplacement' }]}
        jobTitles={[]}
        recruiters={[]}
        submitting={false}
        onCreate={() => {}}
        onCreateJobTitle={async (name) => ({ id: 'jt', name })}
      />,
    )

    expect(screen.getByText('Intérim')).toBeInTheDocument()
  })
})
