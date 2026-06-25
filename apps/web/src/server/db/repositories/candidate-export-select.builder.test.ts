import { describe, expect, it } from 'vitest'
import { buildCandidateExportSelect } from '@/server/db/repositories/candidate-export-select.builder'
import { resolveCandidateExportColumnIds } from '@/view-models/cvtheque-export-columns'

describe('resolveCandidateExportColumnIds', () => {
  it('adds identity fields and active sort column to fetch ids', () => {
    const ids = resolveCandidateExportColumnIds(['email'], { columnId: 'city', direction: 'asc' })

    expect(ids).toEqual(expect.arrayContaining(['firstName', 'lastName', 'email', 'city']))
  })
})

describe('buildCandidateExportSelect', () => {
  it('always includes identity fields for row mapping', () => {
    const select = buildCandidateExportSelect(['email'])

    expect(select).toEqual({
      firstName: true,
      lastName: true,
      email: true,
    })
  })

  it('selects only fields required by requested columns', () => {
    const select = buildCandidateExportSelect(['lastName', 'email', 'jobTitle'])

    expect(select).toEqual({
      firstName: true,
      lastName: true,
      email: true,
      jobTitle: { select: { name: true } },
    })
  })

  it('includes postalCode when department is requested', () => {
    const select = buildCandidateExportSelect(['department'])

    expect(select).toEqual({ firstName: true, lastName: true, postalCode: true })
  })
})
