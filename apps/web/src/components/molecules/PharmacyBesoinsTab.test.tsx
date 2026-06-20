import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PharmacyBesoinsTab } from '@/components/molecules/PharmacyBesoinsTab'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
}))

describe('PharmacyBesoinsTab', () => {
  it('navigates to the mission detail when a row is clicked', () => {
    render(
      <PharmacyBesoinsTab
        pharmacyId="p1"
        missions={[
          {
            id: 'm1',
            title: 'Titulaire CDI',
            jobTitle: 'Pharmacien',
            contractType: 'CDI',
            status: 'A_POURVOIR',
            startDate: new Date('2026-03-01'),
            referent: 'Réf Demo',
          },
        ]}
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
})
