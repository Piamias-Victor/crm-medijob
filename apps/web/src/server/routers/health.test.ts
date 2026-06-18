import { describe, it, expect } from 'vitest'
import { appRouter } from '@/server/routers/_app'
import { createTRPCContext, createCallerFactory } from '@/server/trpc'

describe('health.check', () => {
  it('returns an ok status', async () => {
    const caller = createCallerFactory(appRouter)(await createTRPCContext())

    const result = await caller.health.check()

    expect(result).toEqual({ status: 'ok' })
  })
})
