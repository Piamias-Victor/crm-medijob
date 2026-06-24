import { describe, expect, it } from 'vitest'
import { referentialQueriesFor } from './home-referential-queries'

describe('referentialQueriesFor', () => {
  it('loads mission referentials for candidate, mission and contact modals', () => {
    expect(referentialQueriesFor('candidate')).toEqual({ mission: true, pharmacy: false })
    expect(referentialQueriesFor('mission')).toEqual({ mission: true, pharmacy: false })
    expect(referentialQueriesFor('contact')).toEqual({ mission: true, pharmacy: false })
  })

  it('loads pharmacy referentials only for pharmacy modal', () => {
    expect(referentialQueriesFor('pharmacy')).toEqual({ mission: false, pharmacy: true })
  })

  it('loads nothing when no modal is open', () => {
    expect(referentialQueriesFor(null)).toEqual({ mission: false, pharmacy: false })
  })
})
