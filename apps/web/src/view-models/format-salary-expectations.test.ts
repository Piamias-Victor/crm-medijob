// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatSalaryExpectations } from '@/view-models/format-salary-expectations'

describe('formatSalaryExpectations', () => {
  it('prefers free-text pretentions', () => {
    expect(
      formatSalaryExpectations({
        salaryExpectations: '45k brut',
        salaryMin: 40000,
        salaryMax: 50000,
      }),
    ).toBe('45k brut')
  })

  it('formats min/max when text absent', () => {
    expect(
      formatSalaryExpectations({
        salaryExpectations: null,
        salaryMin: 40000,
        salaryMax: null,
      }),
    ).toBe('40000 – — €')
  })

  it('returns null when empty', () => {
    expect(
      formatSalaryExpectations({
        salaryExpectations: '  ',
        salaryMin: null,
        salaryMax: null,
      }),
    ).toBeNull()
  })
})
