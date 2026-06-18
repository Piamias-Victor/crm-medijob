// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest'
import { appRouter } from '@/server/routers/_app'
import { createCallerFactory } from '@/server/trpc'

const authed = { session: { user: { id: 'u1', role: 'RECRUTEUR' }, expires: '' } }

function caller(ctx: unknown) {
  return createCallerFactory(appRouter)(ctx as never)
}

describe('assistant.chat', () => {
  beforeEach(() => {
    process.env.EXTRACTION_PROVIDER = 'mock'
    delete process.env.GEMINI_API_KEY
  })

  it('returns a validated reply for a RECRUTEUR', async () => {
    const result = await caller(authed).assistant.chat({ message: 'Bonjour' })
    expect(result.kind).toBe('chat')
    expect(result.text).toContain('Bonjour')
  })

  it('rejects an unauthenticated caller', async () => {
    await expect(caller({ session: null }).assistant.chat({ message: 'hi' })).rejects.toThrow()
  })

  it('rejects an empty input (no message, no shortcut)', async () => {
    await expect(caller(authed).assistant.chat({})).rejects.toThrow()
  })
})

describe('assistant.searchEntities', () => {
  it('returns [] for a blank term (no DB access) for a RECRUTEUR', async () => {
    const result = await caller(authed).assistant.searchEntities({
      entityType: 'candidate',
      term: '   ',
    })
    expect(result).toEqual([])
  })

  it('rejects an unauthenticated caller', async () => {
    await expect(
      caller({ session: null }).assistant.searchEntities({ entityType: 'pharmacy', term: 'x' }),
    ).rejects.toThrow()
  })
})
