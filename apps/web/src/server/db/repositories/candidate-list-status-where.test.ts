// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildEffectiveStatusWhere } from '@/server/db/repositories/candidate-list-status-where'

describe('buildEffectiveStatusWhere', () => {
  it('filtre En mission = positionnement actif sans override', () => {
    expect(buildEffectiveStatusWhere(['EN_MISSION'])).toMatchObject({
      AND: [
        { status: { notIn: ['INACTIF', 'BLACKLISTE'] } },
        { missions: { some: expect.objectContaining({}) } },
      ],
    })
  })

  it('filtre Blacklisté = statut stocké', () => {
    expect(buildEffectiveStatusWhere(['BLACKLISTE'])).toEqual({ status: 'BLACKLISTE' })
  })

  it('filtre Qualifié exclut positionnements actifs', () => {
    expect(buildEffectiveStatusWhere(['QUALIFIE'])).toMatchObject({
      AND: [{ status: 'QUALIFIE' }, { NOT: expect.objectContaining({}) }],
    })
  })
})
