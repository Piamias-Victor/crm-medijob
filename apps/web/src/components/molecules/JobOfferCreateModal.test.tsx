import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { JobOfferCreateModal } from '@/components/molecules/JobOfferCreateModal'
import {
  PICK_MISSION_CANCEL,
  PICK_MISSION_CONTINUE,
  PICK_MISSION_TITLE,
} from '@/view-models/mission-offer-picker'

const options = [{ value: 'm1', label: 'CDI Pharmacien Lyon — Pharmacie du Parc' }]

describe('JobOfferCreateModal', () => {
  it('keeps Continuer disabled without a mission', () => {
    const onContinue = vi.fn()
    render(
      <JobOfferCreateModal
        open
        options={options}
        missionId=""
        onMissionIdChange={vi.fn()}
        onClose={vi.fn()}
        onContinue={onContinue}
      />,
    )
    expect(screen.getByText(PICK_MISSION_TITLE)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: PICK_MISSION_CONTINUE })).toBeDisabled()
    expect(onContinue).not.toHaveBeenCalled()
  })

  it('continues when a mission is selected', () => {
    const onContinue = vi.fn()
    render(
      <JobOfferCreateModal
        open
        options={options}
        missionId="m1"
        onMissionIdChange={vi.fn()}
        onClose={vi.fn()}
        onContinue={onContinue}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: PICK_MISSION_CONTINUE }))
    expect(onContinue).toHaveBeenCalled()
  })

  it('closes on cancel', () => {
    const onClose = vi.fn()
    render(
      <JobOfferCreateModal
        open
        options={options}
        missionId="m1"
        onMissionIdChange={vi.fn()}
        onClose={onClose}
        onContinue={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: PICK_MISSION_CANCEL }))
    expect(onClose).toHaveBeenCalled()
  })
})
