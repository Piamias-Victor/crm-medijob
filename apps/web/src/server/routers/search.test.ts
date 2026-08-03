// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeSearchRouter } from '@/server/routers/search'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

describe('search.global', () => {
  it('delegates to globalSearch for authenticated users', async () => {
    const result = {
      pharmacies: [{ id: 'p1', label: 'Pharma', href: '/pharmacies/p1' }],
      contacts: [],
      candidates: [],
      missions: [],
    }
    const global = vi.fn().mockResolvedValue(result)
    const caller = createCallerFactory(makeSearchRouter({ global }))({ session })
    await expect(caller.global({ term: 'ph' })).resolves.toEqual(result)
    expect(global).toHaveBeenCalledWith('ph')
  })

  it('rejects an unauthenticated caller', async () => {
    const anon = createCallerFactory(makeSearchRouter({ global: vi.fn() }))({
      session: null,
    } as never)
    await expect(anon.global({ term: 'ph' })).rejects.toThrow()
  })
})
