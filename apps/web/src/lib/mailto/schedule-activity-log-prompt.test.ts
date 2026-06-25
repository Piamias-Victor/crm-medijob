import { describe, it, expect, vi, afterEach } from 'vitest'
import { scheduleActivityLogPrompt } from '@/lib/mailto/schedule-activity-log-prompt'

describe('scheduleActivityLogPrompt', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('fires only once when both focus and timeout occur', async () => {
    vi.useFakeTimers()
    const onPrompt = vi.fn()

    scheduleActivityLogPrompt(onPrompt)
    window.dispatchEvent(new Event('focus'))
    await vi.advanceTimersByTimeAsync(500)

    expect(onPrompt).toHaveBeenCalledOnce()
  })
})
