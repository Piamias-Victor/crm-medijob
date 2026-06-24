import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmailButton } from '@/components/molecules/email-button/email-button'

const cleanup = vi.fn()

vi.mock('@/lib/mailto/open-email-compose', () => ({ openEmailCompose: vi.fn(() => true) }))
vi.mock('@/lib/mailto/schedule-activity-log-prompt', () => ({
  scheduleActivityLogPrompt: vi.fn(() => cleanup),
}))

describe('EmailButton unmount', () => {
  it('cancels a scheduled activity prompt when unmounted', () => {
    const { unmount } = render(
      <EmailButton to="candidat@example.com" activityLogContext={{ candidateId: 'c1' }} />,
    )

    fireEvent.click(screen.getByRole('button', { name: /envoyer un email/i }))
    unmount()

    expect(cleanup).toHaveBeenCalled()
  })
})
