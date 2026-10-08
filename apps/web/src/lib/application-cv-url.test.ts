import { describe, it, expect } from 'vitest'
import { applicationCvApiPath } from '@/lib/application-cv-url'

describe('applicationCvApiPath', () => {
  it('builds the authenticated preview route for an application', () => {
    expect(applicationCvApiPath('a1')).toBe('/api/applications/a1/cv')
  })
})
