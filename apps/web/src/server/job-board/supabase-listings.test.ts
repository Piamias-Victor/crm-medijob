// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createSupabaseListingsPort } from '@/server/job-board/supabase-listings'
import type { BoardListing } from '@/server/job-board/port'

const listing: BoardListing = {
  titre: 'Pharmacien',
  metier: 'Pharmacien',
  description: 'Poste',
  entreprise: 'Pharmacie du Parc',
  ville: 'Lyon',
  type_contrat: 'CDI',
  temps_travail: 'Temps plein',
  contact_email: 'offres@medijob.fr',
  publiee: true,
  mise_en_avant: false,
}

describe('createSupabaseListingsPort', () => {
  it('inserts offres without source_crm_id', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: 'new-uuid' }],
    })
    const port = createSupabaseListingsPort(
      { url: 'https://board.supabase.co', secret: 's' },
      fetchFn,
    )
    await expect(port.upsert(listing)).resolves.toEqual({ id: 'new-uuid' })
    const [url, init] = fetchFn.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://board.supabase.co/rest/v1/offres')
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).not.toHaveProperty('source_crm_id')
  })

  it('hides a listing with PATCH and never DELETE', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
    const port = createSupabaseListingsPort(
      { url: 'https://board.supabase.co', secret: 's' },
      fetchFn,
    )
    await port.setPubliee('board-uuid', false)
    expect(fetchFn).toHaveBeenCalledWith(
      'https://board.supabase.co/rest/v1/offres?id=eq.board-uuid',
      expect.objectContaining({ method: 'PATCH' }),
    )
    expect(JSON.parse(String((fetchFn.mock.calls[0]?.[1] as RequestInit).body))).toEqual({
      publiee: false,
    })
    expect(fetchFn.mock.calls.some((call) => (call[1] as RequestInit).method === 'DELETE')).toBe(
      false,
    )
  })
})
