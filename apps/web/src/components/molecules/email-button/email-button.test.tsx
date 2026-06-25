import './email-button.test.fixtures'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EmailButton } from '@/components/molecules/email-button/email-button'
import { openEmailCompose } from '@/lib/mailto/open-email-compose'
import { scheduleActivityLogPrompt } from '@/lib/mailto/schedule-activity-log-prompt'
import { useToastStore } from '@/stores/toast-store'
import { mutateAsync } from '@/components/molecules/email-button/email-button.test.fixtures'
import {
  ACTIVITY_LOG_ERROR,
  ACTIVITY_LOG_SUCCESS,
  EMAIL_INVALID_TOOLTIP,
  EMAIL_MISSING_TOOLTIP,
} from '@/components/molecules/email-button/email-button-copy'

describe('EmailButton', () => {
  beforeEach(() => {
    mutateAsync.mockReset()
    mutateAsync.mockResolvedValue([])
    useToastStore.setState({ toasts: [] })
    vi.mocked(openEmailCompose).mockReturnValue(true)
    vi.mocked(openEmailCompose).mockClear()
    vi.mocked(scheduleActivityLogPrompt).mockClear()
  })

  it('disables the button when the recipient is missing or invalid', () => {
    const { rerender } = render(<EmailButton to="" />)
    expect(screen.getByRole('button', { name: /envoyer un email/i })).toHaveAttribute('title', EMAIL_MISSING_TOOLTIP)
    rerender(<EmailButton to="pas-un-email" />)
    expect(screen.getByRole('button', { name: /envoyer un email/i })).toHaveAttribute('title', EMAIL_INVALID_TOOLTIP)
  })

  it('opens Gmail compose by default on click', () => {
    render(<EmailButton to="candidat@example.com" subject="Bonjour" />)
    fireEvent.click(screen.getByRole('button', { name: /envoyer un email/i }))
    expect(openEmailCompose).toHaveBeenCalledWith(
      expect.stringContaining('https://mail.google.com/mail/?'),
      'gmail',
    )
  })

  it('schedules activity logging after a successful Gmail open', () => {
    render(<EmailButton to="candidat@example.com" />)
    fireEvent.click(screen.getByRole('button', { name: /envoyer un email/i }))
    expect(openEmailCompose).toHaveBeenCalled()
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('delegates activity logging to the parent when onActivityLogPrompt is provided', () => {
    const onActivityLogPrompt = vi.fn()
    render(
      <EmailButton
        to="candidat@example.com"
        subject="Présentation"
        activityLogContext={{ candidateId: 'c1', pharmacyId: 'p1', contactId: 'ct1' }}
        onActivityLogPrompt={onActivityLogPrompt}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /envoyer un email/i }))
    expect(onActivityLogPrompt).toHaveBeenCalledWith({
      scopes: expect.arrayContaining([
        expect.objectContaining({ entityType: 'CANDIDATE', entityId: 'c1' }),
        expect.objectContaining({ entityType: 'PHARMACY', entityId: 'p1' }),
        expect.objectContaining({ entityType: 'CONTACT', entityId: 'ct1' }),
      ]),
      defaultContent: 'Présentation',
    })
    expect(screen.queryByRole('button', { name: 'Enregistrer' })).toBeNull()
  })

  it('creates one EMAIL batch when the user confirms activity logging', async () => {
    render(
      <EmailButton
        to="candidat@example.com"
        subject="Présentation"
        activityLogContext={{ candidateId: 'c1', missionId: 'm1' }}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /envoyer un email/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    await waitFor(() => expect(mutateAsync).toHaveBeenCalledOnce())
    expect(mutateAsync).toHaveBeenCalledWith({
      entries: [
        expect.objectContaining({ entityType: 'CANDIDATE', entityId: 'c1', type: 'EMAIL', content: 'Présentation' }),
        expect.objectContaining({ entityType: 'MISSION', entityId: 'm1', type: 'EMAIL', content: 'Présentation' }),
      ],
    })
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe(ACTIVITY_LOG_SUCCESS)
  })

  it('shows an error toast when saving the activity fails', async () => {
    mutateAsync.mockRejectedValueOnce(new Error('network'))
    render(<EmailButton to="candidat@example.com" activityLogContext={{ candidateId: 'c1' }} />)
    fireEvent.click(screen.getByRole('button', { name: /envoyer un email/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    await waitFor(() => expect(useToastStore.getState().toasts.at(-1)?.message).toBe(ACTIVITY_LOG_ERROR))
  })
})
