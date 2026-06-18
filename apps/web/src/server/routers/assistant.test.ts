// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeAssistantRouter } from '@/server/routers/assistant'

const authed = { session: { user: { id: 'u1', role: 'RECRUTEUR' }, expires: '' } }

function caller(runChat: ReturnType<typeof vi.fn>) {
  return createCallerFactory(
    makeAssistantRouter({
      runChat,
      searchEntities: vi.fn().mockResolvedValue([]),
    }),
  )(authed as never)
}

describe('assistant.chat', () => {
  beforeEach(() => {
    process.env.EXTRACTION_PROVIDER = 'mock'
    delete process.env.GEMINI_API_KEY
  })

  it('returns a validated reply for a RECRUTEUR', async () => {
    const runChat = vi.fn().mockResolvedValue({ kind: 'chat', text: 'Bonjour !' })
    const result = await caller(runChat).chat({ message: 'Bonjour' })
    expect(result.kind).toBe('chat')
    expect(result.text).toContain('Bonjour')
  })

  it('surfaces an unknown shortcut as NOT_FOUND', async () => {
    const runChat = vi.fn().mockRejectedValue(new Error('UNKNOWN_SHORTCUT'))
    await expect(caller(runChat).chat({ shortcutId: 'missing' })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    })
  })

  it('surfaces invalid provider output as BAD_REQUEST', async () => {
    const runChat = vi.fn().mockRejectedValue(new Error('AI_RESPONSE_NOT_JSON'))
    await expect(caller(runChat).chat({ message: 'test' })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
  })

  it('rejects an unauthenticated caller', async () => {
    const runChat = vi.fn()
    const anon = createCallerFactory(
      makeAssistantRouter({ runChat, searchEntities: vi.fn() }),
    )({ session: null } as never)
    await expect(anon.chat({ message: 'hi' })).rejects.toThrow()
  })

  it('rejects an empty input (no message, no shortcut)', async () => {
    const runChat = vi.fn()
    await expect(caller(runChat).chat({})).rejects.toThrow()
  })
})

describe('assistant.searchEntities', () => {
  it('returns [] for a blank term (no DB access) for a RECRUTEUR', async () => {
    const searchEntities = vi.fn().mockResolvedValue([])
    const c = createCallerFactory(
      makeAssistantRouter({ runChat: vi.fn(), searchEntities }),
    )(authed as never)
    const result = await c.searchEntities({ entityType: 'candidate', term: '   ' })
    expect(result).toEqual([])
  })

  it('rejects an unauthenticated caller', async () => {
    const anon = createCallerFactory(
      makeAssistantRouter({ runChat: vi.fn(), searchEntities: vi.fn() }),
    )({ session: null } as never)
    await expect(
      anon.searchEntities({ entityType: 'pharmacy', term: 'x' }),
    ).rejects.toThrow()
  })
})
