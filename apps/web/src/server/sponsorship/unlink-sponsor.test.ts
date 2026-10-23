import { describe, expect, it } from 'vitest'
import { unlinkSponsor } from '@/server/sponsorship/unlink-sponsor'
import { memoryLinkDeps } from '@/server/sponsorship/link-sponsor.test-fixtures'

describe('unlinkSponsor', () => {
  it('clears marraine and logs both fiches', async () => {
    const deps = memoryLinkDeps([
      { id: 'm', name: 'Marraine', sponsorId: null },
      { id: 'f', name: 'Filleule', sponsorId: 'm' },
    ])
    await unlinkSponsor({ filleuleId: 'f' }, 'user-1', deps)
    expect(deps.rows.get('f')?.sponsorId).toBeNull()
    expect(deps.logs).toEqual([
      {
        entityId: 'f',
        authorId: 'user-1',
        content: 'Parrainage — marraine retirée : Marraine',
      },
      {
        entityId: 'm',
        authorId: 'user-1',
        content: 'Parrainage — filleule retirée : Filleule',
      },
    ])
  })

  it('no-ops when no marraine', async () => {
    const deps = memoryLinkDeps([{ id: 'f', name: 'Filleule', sponsorId: null }])
    await unlinkSponsor({ filleuleId: 'f' }, 'user-1', deps)
    expect(deps.logs).toEqual([])
  })
})
