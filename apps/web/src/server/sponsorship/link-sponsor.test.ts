import { describe, expect, it } from 'vitest'
import { linkSponsor } from '@/server/sponsorship/link-sponsor'
import { memoryLinkDeps } from '@/server/sponsorship/link-sponsor.test-fixtures'

describe('linkSponsor', () => {
  it('sets marraine on filleule and logs both fiches', async () => {
    const deps = memoryLinkDeps([
      { id: 'marraine', name: 'Pharma A', sponsorId: null },
      { id: 'filleule', name: 'Pharma B', sponsorId: null },
    ])
    await linkSponsor(
      { filleuleId: 'filleule', sponsorId: 'marraine' },
      'user-1',
      deps,
    )
    expect(deps.rows.get('filleule')?.sponsorId).toBe('marraine')
    expect(deps.logs).toEqual([
      {
        entityId: 'filleule',
        authorId: 'user-1',
        content: 'Parrainage — marraine définie : Pharma A',
      },
      {
        entityId: 'marraine',
        authorId: 'user-1',
        content: 'Parrainage — filleule ajoutée : Pharma B',
      },
    ])
  })

  it('refuses self-link', async () => {
    const deps = memoryLinkDeps([{ id: 'a', name: 'Pharma A', sponsorId: null }])
    await expect(
      linkSponsor({ filleuleId: 'a', sponsorId: 'a' }, 'user-1', deps),
    ).rejects.toThrow('SPONSORSHIP_SELF')
    expect(deps.logs).toEqual([])
  })

  it('refuses cycle A↔B', async () => {
    const deps = memoryLinkDeps([
      { id: 'a', name: 'A', sponsorId: null },
      { id: 'b', name: 'B', sponsorId: 'a' },
    ])
    await expect(
      linkSponsor({ filleuleId: 'a', sponsorId: 'b' }, 'user-1', deps),
    ).rejects.toThrow('SPONSORSHIP_CYCLE')
    expect(deps.rows.get('a')?.sponsorId).toBeNull()
  })

  it('refuses transfer without confirm', async () => {
    const deps = memoryLinkDeps([
      { id: 'old', name: 'Old', sponsorId: null },
      { id: 'neu', name: 'New', sponsorId: null },
      { id: 'f', name: 'Filleule', sponsorId: 'old' },
    ])
    await expect(
      linkSponsor({ filleuleId: 'f', sponsorId: 'neu' }, 'user-1', deps),
    ).rejects.toThrow('SPONSORSHIP_TRANSFER_REQUIRED')
    expect(deps.rows.get('f')?.sponsorId).toBe('old')
  })

  it('transfers filleule with confirm and logs old marraine', async () => {
    const deps = memoryLinkDeps([
      { id: 'old', name: 'Old', sponsorId: null },
      { id: 'neu', name: 'New', sponsorId: null },
      { id: 'f', name: 'Filleule', sponsorId: 'old' },
    ])
    await linkSponsor(
      { filleuleId: 'f', sponsorId: 'neu', confirmTransfer: true },
      'user-1',
      deps,
    )
    expect(deps.rows.get('f')?.sponsorId).toBe('neu')
    expect(deps.logs).toContainEqual({
      entityId: 'old',
      authorId: 'user-1',
      content: 'Parrainage — filleule retirée : Filleule',
    })
    expect(deps.logs).toContainEqual({
      entityId: 'f',
      authorId: 'user-1',
      content: 'Parrainage — marraine définie : New',
    })
    expect(deps.logs).toContainEqual({
      entityId: 'neu',
      authorId: 'user-1',
      content: 'Parrainage — filleule ajoutée : Filleule',
    })
  })
})
