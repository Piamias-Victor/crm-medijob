import { describe, expect, it } from 'vitest'
import { referentialQueriesFor } from './home-referential-queries'

describe('referentialQueriesFor', () => {
  it('loads mission referentials for mission and contact modals', () => {
    expect(referentialQueriesFor('mission')).toEqual({ mission: true })
    expect(referentialQueriesFor('contact')).toEqual({ mission: true })
  })

  it('loads nothing when no modal is open', () => {
    expect(referentialQueriesFor(null)).toEqual({ mission: false })
  })
})
