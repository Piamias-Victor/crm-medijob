// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { runAssistantChat } from './chat-handler'
import type { AssistantRequest } from './provider'
import { deps, fakeProvider, weekLoader } from './chat-handler.test.fixtures'

describe('runAssistantChat shortcuts data', () => {
  it('injects assembled week-report metrics into the prompt', async () => {
    let seen: AssistantRequest | undefined
    const result = await runAssistantChat(
      { shortcutId: 'week-report' },
      deps('{"report":"CR ok"}', (req) => (seen = req), {
        weekReport: weekLoader(),
        referentId: 'u1',
        now: new Date('2026-08-05T12:30:00.000Z'),
      }),
    )
    expect(result).toEqual({ kind: 'report', text: 'CR ok' })
    expect(seen?.prompt).toContain('missions ouvertes: 2')
    expect(seen?.prompt).toContain('candidatures reçues: 4')
    expect(seen?.prompt).toContain('référent: u1')
  })

  it('injects matching scores for best-profiles shortcut', async () => {
    let seen: AssistantRequest | undefined
    const matching = {
      findMission: vi.fn().mockResolvedValue({
        id: 'm1',
        title: 'CDI Lyon',
        jobTitleId: 'jt1',
        jobTitle: { name: 'Pharmacien' },
        pharmacy: { name: 'Pharma', city: 'Lyon', postalCode: '69001' },
        description: null,
        contractType: 'CDI',
        startDate: new Date('2026-08-01'),
      }),
      listCandidates: vi.fn().mockResolvedValue([]),
      listCompatibilities: vi.fn().mockResolvedValue([]),
      provider: fakeProvider('[]'),
      lookupGeo: async () => ({ lat: 45.75, lon: 4.85 }),
    }
    const result = await runAssistantChat(
      { shortcutId: 'best-profiles', context: { entityType: 'mission', entityId: 'm1' } },
      deps('{"summary":"Top profils"}', (req) => (seen = req), { matching }),
    )
    expect(result.kind).toBe('summary')
    expect(seen?.prompt).toContain('aucun candidat scoré')
  })

  it('throws when best-profiles has no mission context', async () => {
    await expect(
      runAssistantChat({ shortcutId: 'best-profiles' }, deps('{"summary":"x"}')),
    ).rejects.toThrow('BEST_PROFILES_MISSION_REQUIRED')
  })
})
