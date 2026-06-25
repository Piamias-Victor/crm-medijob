import { vi } from 'vitest'

export const mutateAsync = vi.fn()
export const invalidate = vi.fn()

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
