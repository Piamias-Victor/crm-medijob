import { describe, expect, it, vi } from 'vitest'
import { testBadakanClient } from './client-test-client'

describe('createBadakanClient getComments', () => {
  it('gets comments for a target with GET', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ securityToken: 'tok' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 'c1',
            comment: 'Répondeur : Entretien téléphonique.',
            creationDate: '2026-03-12T14:32:00.000Z',
            author: { firstName: 'Jensie', lastName: 'Deslances' },
          },
        ],
      })

    const rows = await testBadakanClient(fetchFn).getComments('tounkara-id')
    expect(rows).toHaveLength(1)
    expect(rows[0]?.content).toBe('Répondeur : Entretien téléphonique.')
    expect(rows[0]?.authorName).toBe('Jensie Deslances')
    expect(rows[0]?.date.toISOString()).toBe('2026-03-12T14:32:00.000Z')
    expect(String(fetchFn.mock.calls[1]?.[0])).toContain(
      '/services/v3/comments/target/tounkara-id',
    )
    const init = fetchFn.mock.calls[1]?.[1] as RequestInit
    expect(init.method ?? 'GET').toBe('GET')
    expect(init.headers).toMatchObject({ security_token: 'tok' })
  })

  it('maps a paged comments envelope without POST', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ securityToken: 'tok' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              id: 'c1',
              comment: 'Répondeur : Entretien téléphonique.',
              creationDate: '2026-03-12T14:32:00.000Z',
              author: { firstName: 'Jensie', lastName: 'Deslances' },
            },
          ],
        }),
      })

    const rows = await testBadakanClient(fetchFn).getComments('tounkara-id')
    expect(rows[0]?.content).toBe('Répondeur : Entretien téléphonique.')
    const init = fetchFn.mock.calls[1]?.[1] as RequestInit
    expect(init.method ?? 'GET').toBe('GET')
  })
})
