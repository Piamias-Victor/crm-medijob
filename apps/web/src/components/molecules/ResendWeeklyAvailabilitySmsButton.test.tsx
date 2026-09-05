import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ResendWeeklyAvailabilitySmsButton } from './ResendWeeklyAvailabilitySmsButton'
import { useToastStore } from '@/stores/toast-store'
import { WEEKLY_AVAILABILITY_COPY } from '@/view-models/weekly-availability-copy'

const mutateAsync = vi.fn()

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    weeklyAvailability: {
      resendSms: {
        useMutation: () => ({ mutateAsync, isPending: false }),
      },
    },
  },
}))

describe('ResendWeeklyAvailabilitySmsButton', () => {
  beforeEach(() => {
    mutateAsync.mockReset()
    mutateAsync.mockResolvedValue({ sent: true })
    useToastStore.setState({ toasts: [] })
  })

  it('resends the same weekly availability URL by email', async () => {
    render(<ResendWeeklyAvailabilitySmsButton candidateId="c1" />)
    fireEvent.click(screen.getByRole('button', { name: WEEKLY_AVAILABILITY_COPY.resendSms }))
    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith({ id: 'c1' }))
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe(WEEKLY_AVAILABILITY_COPY.resent)
  })
})
