import { vi } from 'vitest'

export const mutateAsync = vi.fn()
export const invalidate = vi.fn()

vi.mock('@/lib/mailto/open-email-compose', () => ({ openEmailCompose: vi.fn(() => true) }))
vi.mock('@/lib/mailto/schedule-activity-log-prompt', () => ({
  scheduleActivityLogPrompt: vi.fn((onPrompt: () => void) => {
    onPrompt()
    return vi.fn()
  }),
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))
vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    useUtils: () => ({ activityLog: { listByEntity: { invalidate } } }),
    activityLog: {
      createBatch: { useMutation: () => ({ mutateAsync, isPending: false }) },
    },
  },
}))
