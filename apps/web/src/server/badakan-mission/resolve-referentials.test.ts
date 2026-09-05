// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { makeMissionReferentialResolver } from './resolve-referentials'

const jobTitles = [
  { id: 'jt-preparateur', name: 'Préparateur' },
  { id: 'jt-pharmacien', name: 'Pharmacien' },
]
const softwares = [{ id: 'sw-lgpi', name: 'LGPI' }]

function deps(askJobTitle?: (label: string) => Promise<string | null>) {
  return {
    listJobTitles: async () => jobTitles,
    listSoftwares: async () => softwares,
    askJobTitle,
  }
}

describe('makeMissionReferentialResolver', () => {
  it('resolves the job title and the LGO without any AI call', async () => {
    const askJobTitle = vi.fn()
    const resolve = makeMissionReferentialResolver(deps(askJobTitle))
    expect(
      await resolve({ activityLabel: 'Préparateur Expert', softwareLabel: 'logiciel : LGPI' }),
    ).toEqual({ jobTitleId: 'jt-preparateur', softwareId: 'sw-lgpi' })
    expect(askJobTitle).not.toHaveBeenCalled()
  })

  it('asks the AI only for an activity it cannot read', async () => {
    const askJobTitle = vi.fn(async () => 'jt-pharmacien')
    const resolve = makeMissionReferentialResolver(deps(askJobTitle))
    expect(await resolve({ activityLabel: 'Docteur en officine', softwareLabel: null })).toEqual({
      jobTitleId: 'jt-pharmacien',
      softwareId: null,
    })
    expect(askJobTitle).toHaveBeenCalledWith('Docteur en officine', jobTitles)
  })

  it('asks the AI once per label, even across missions', async () => {
    const askJobTitle = vi.fn(async () => 'jt-pharmacien')
    const resolve = makeMissionReferentialResolver(deps(askJobTitle))
    await resolve({ activityLabel: 'Docteur en officine', softwareLabel: null })
    await resolve({ activityLabel: 'Docteur en officine', softwareLabel: null })
    expect(askJobTitle).toHaveBeenCalledTimes(1)
  })

  it('leaves the mission unresolved when the AI answers nothing usable', async () => {
    const resolve = makeMissionReferentialResolver(deps(async () => 'jt-unknown'))
    expect(await resolve({ activityLabel: 'Ninja', softwareLabel: null })).toEqual({
      jobTitleId: null,
      softwareId: null,
    })
  })

  it('works without any AI provider at all', async () => {
    const resolve = makeMissionReferentialResolver(deps())
    expect(await resolve({ activityLabel: 'Ninja', softwareLabel: null })).toEqual({
      jobTitleId: null,
      softwareId: null,
    })
  })
})
