import './activity-log-prompt-modal.test.fixtures'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ActivityLogPromptModal } from '@/components/molecules/email-button/activity-log-prompt-modal'
import { mutateAsync, invalidate } from '@/components/molecules/email-button/activity-log-prompt-modal.test.fixtures'
import { ACTIVITY_LOG_SUCCESS } from '@/components/molecules/email-button/email-button-copy'
import { useToastStore } from '@/stores/toast-store'

describe('ActivityLogPromptModal', () => {
  beforeEach(() => {
    mutateAsync.mockReset()
    mutateAsync.mockResolvedValue([])
    invalidate.mockReset()
    useToastStore.setState({ toasts: [] })
  })

  it('saves all scopes in one batch when the user confirms', async () => {
    render(
      <ActivityLogPromptModal
        open
        onOpenChange={vi.fn()}
        defaultContent="Présentation"
        scopes={[
          { entityType: 'CANDIDATE', entityId: 'c1' },
          { entityType: 'MISSION', entityId: 'm1' },
        ]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledOnce())
    expect(mutateAsync).toHaveBeenCalledWith({
      entries: [
        expect.objectContaining({ entityType: 'CANDIDATE', entityId: 'c1', type: 'EMAIL', content: 'Présentation' }),
        expect.objectContaining({ entityType: 'MISSION', entityId: 'm1', type: 'EMAIL', content: 'Présentation' }),
      ],
    })
    expect(invalidate).toHaveBeenCalledTimes(2)
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe(ACTIVITY_LOG_SUCCESS)
  })
})
