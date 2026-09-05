import { describe, expect, it, vi } from 'vitest'
import { enrichFromComments } from './enrich-from-comments'

const lgpiComment = {
  id: 'c1',
  content: 'Préparatrice diplômée. Dispo 15/09. Logiciel LGPI.',
  authorName: 'Jensie Deslances',
  date: new Date('2026-03-12T14:32:00.000Z'),
}

const refs = {
  softwares: [{ id: 'sw-lgpi', name: 'LGPI' }],
  jobTitles: [
    { id: 'jt-pharma', name: 'Pharmacien' },
    { id: 'jt-prepa', name: 'Préparateur en pharmacie' },
  ],
}

describe('enrichFromComments', () => {
  it('maps AI software names onto catalog ids and keeps Badakan notes', async () => {
    const patch = await enrichFromComments(refs, [lgpiComment], async () =>
      JSON.stringify({
        softwares: ['LGPI'],
        availableFrom: '2026-09-15T00:00:00.000Z',
        mobilityRadiusKm: 30,
      }),
    )
    expect(patch.softwareIds).toEqual(['sw-lgpi'])
    expect(patch.availableFrom).toEqual(new Date('2026-09-15T00:00:00.000Z'))
    expect(patch.mobilityRadiusKm).toBe(30)
    expect(patch.notes).toContain('Logiciel LGPI.')
    expect(patch.notes).toContain('Jensie Deslances')
  })

  it('maps « Préparatrice » from the comment onto the JobTitle referential', async () => {
    const patch = await enrichFromComments(refs, [lgpiComment], async () =>
      JSON.stringify({ jobTitle: 'Préparatrice' }),
    )
    expect(patch.jobTitleId).toBe('jt-prepa')
  })

  it('leaves the job title unset when the AI label matches nothing', async () => {
    const patch = await enrichFromComments(refs, [lgpiComment], async () =>
      JSON.stringify({ jobTitle: 'Astronaute' }),
    )
    expect(patch.jobTitleId).toBeUndefined()
  })

  it('skips AI when there are no comments', async () => {
    const complete = vi.fn()
    const patch = await enrichFromComments(refs, [], complete)
    expect(patch).toEqual({})
    expect(complete).not.toHaveBeenCalled()
  })

  it('keeps Badakan notes when AI fails', async () => {
    const patch = await enrichFromComments(refs, [lgpiComment], async () => {
      throw new Error('OPENROUTER_REQUEST_FAILED')
    })
    expect(patch.notes).toContain('Logiciel LGPI.')
    expect(patch.softwareIds).toBeUndefined()
  })
})
