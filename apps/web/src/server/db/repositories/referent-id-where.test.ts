// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { REFERENT_NONE } from '@/lib/constants/referent-none'
import { buildReferentIdWhere } from '@/server/db/repositories/referent-id-where'

describe('buildReferentIdWhere', () => {
  it('filtre ids seuls', () => {
    expect(buildReferentIdWhere(['u1', 'u2'])).toEqual({ referentId: { in: ['u1', 'u2'] } })
  })

  it('filtre sans référent seul', () => {
    expect(buildReferentIdWhere([REFERENT_NONE])).toEqual({ referentId: null })
  })

  it('combine sans référent + ids', () => {
    expect(buildReferentIdWhere([REFERENT_NONE, 'u1'])).toEqual({
      OR: [{ referentId: null }, { referentId: { in: ['u1'] } }],
    })
  })
})
