// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { suiviFamilyHref } from '@/view-models/suivi-family-href'

describe('suiviFamilyHref', () => {
  it('sends staffed family to besoins with STAFFED step filter', () => {
    expect(suiviFamilyHref('staffed')).toBe('/interim/besoins?steps=STAFFED')
  })

  it('sends open and proposed families to matching step filters', () => {
    expect(suiviFamilyHref('open')).toBe('/interim/besoins?steps=CREATED')
    expect(suiviFamilyHref('proposed')).toBe('/interim/besoins?steps=PROPOSE')
  })
})
