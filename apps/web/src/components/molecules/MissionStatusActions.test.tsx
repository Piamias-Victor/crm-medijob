import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MissionStatusActions } from '@/components/molecules/MissionStatusActions'
import { toMissionDetail } from '@/view-models/mission-detail'
import type { MissionDetailEntity } from '@/view-models/mission-detail.types'

const mutate = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    mission: {
      markAnnulee: {
        useMutation: () => ({ mutate, mutateAsync: mutate, isPending: false }),
      },
    },
  },
}))

const missionEntity: MissionDetailEntity = {
  id: 'm1',
  title: 'Titulaire CDI',
  description: null,
  contractType: 'CDI',
  startDate: new Date('2026-03-01'),
  endDate: null,
  status: 'A_POURVOIR',
  salaireMin: null,
  salaireMax: null,
  salaireNotes: null,
  heuresParSemaine: null,
  planning: null,
  tempsPlein: true,
  notes: null,
  pharmacyId: 'p1',
  contactId: null,
  referentId: 'u1',
  jobTitleId: 'jt1',
  updatedAt: new Date(),
  pharmacy: { name: 'Pharmacie', city: 'Lyon' },
  jobTitle: { name: 'Pharmacien' },
  referent: { name: 'Réf Demo' },
  contact: null,
  candidates: [],
}

describe('MissionStatusActions', () => {
  beforeEach(() => {
    mutate.mockClear()
  })

  it('opens SoftDeleteModal before cancelling a mission', () => {
    render(<MissionStatusActions mission={toMissionDetail(missionEntity)} />)

    fireEvent.click(screen.getByRole('button', { name: /annuler la mission/i }))

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /supprimer titulaire cdi/i })).toBeInTheDocument()
    expect(mutate).not.toHaveBeenCalled()
  })
})
