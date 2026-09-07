import { describe, expect, it } from 'vitest'
import { jobTitleIdForAppCreate, jobTitleIdFromActivity } from './job-title-from-activity'

const titles = [
  { id: 'jt-autre', name: 'Autre' },
  { id: 'jt-pharmacien', name: 'Pharmacien' },
  { id: 'jt-preparateur', name: 'Préparateur' },
]

describe('jobTitleIdFromActivity', () => {
  it('maps Badakan Pharmacien Expert to Pharmacien', () => {
    expect(jobTitleIdFromActivity('Pharmacien Expert', titles)).toBe('jt-pharmacien')
  })

  it('maps Badakan Préparateur Expert to Préparateur', () => {
    expect(jobTitleIdFromActivity('Préparateur Expert', titles)).toBe('jt-preparateur')
  })

  it('stays empty when Badakan has no activity', () => {
    expect(jobTitleIdFromActivity(null, titles)).toBeNull()
  })
})

describe('jobTitleIdForAppCreate', () => {
  it('keeps Autre only when Badakan has no métier', () => {
    expect(jobTitleIdForAppCreate(null, titles)).toBe('jt-autre')
  })

  it('does not fall back to Autre when Badakan says Préparateur Expert', () => {
    expect(jobTitleIdForAppCreate('Préparateur Expert', titles)).toBe('jt-preparateur')
  })

  it('uses the comment métier when Badakan activity is empty', () => {
    expect(jobTitleIdForAppCreate(null, titles, 'jt-preparateur')).toBe('jt-preparateur')
  })

  it('keeps Badakan Pharmacien over a Préparateur guessed from comments', () => {
    expect(jobTitleIdForAppCreate('Pharmacien Expert', titles, 'jt-preparateur')).toBe(
      'jt-pharmacien',
    )
  })
})
