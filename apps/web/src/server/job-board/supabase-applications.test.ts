import { describe, expect, it, vi } from 'vitest'
import { createSupabaseApplicationsPort } from './supabase-applications'

describe('createSupabaseApplicationsPort', () => {
  it('lists candidatures without writing', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 'sub-1',
          offre_id: 'listing-1',
          prenom: 'Léa',
          nom: 'Martin',
          email: 'lea@site.fr',
        },
      ],
    })
    const port = createSupabaseApplicationsPort(
      { url: 'https://board.supabase.co', secret: 's' },
      fetchFn,
    )
    const rows = await port.listSubmissions()
    expect(rows[0]?.id).toBe('sub-1')
    const [url, init] = fetchFn.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/rest/v1/candidatures')
    expect(init.method ?? 'GET').toBe('GET')
    expect(init.method).not.toBe('POST')
    expect(init.method).not.toBe('PATCH')
    expect(init.method).not.toBe('DELETE')
  })
})
