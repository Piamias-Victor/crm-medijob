// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest'
import { createOpenRouterProvider } from './openrouter-provider'

afterEach(() => vi.restoreAllMocks())

function mockFetch(body: unknown, status = 200) {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify(body), { status }))
}

describe('createOpenRouterProvider', () => {
  it('posts the prompt + model to OpenRouter and returns the message content', async () => {
    const fetchSpy = mockFetch({ choices: [{ message: { content: '{"reply":"ok"}' } }] })
    const provider = createOpenRouterProvider('sk-or-test', 'google/gemini-2.5-flash-lite')

    const out = await provider.complete({ prompt: 'Bonjour', kind: 'chat' })

    expect(out).toBe('{"reply":"ok"}')
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('openrouter.ai')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer sk-or-test')
    const payload = JSON.parse(init.body as string)
    expect(payload.model).toBe('google/gemini-2.5-flash-lite')
    expect(payload.messages[0].content).toContain('Bonjour')
  })

  it('throws when the request fails', async () => {
    mockFetch('nope', 500)
    const provider = createOpenRouterProvider('k', 'm')
    await expect(provider.complete({ prompt: 'x', kind: 'chat' })).rejects.toThrow()
  })
})
