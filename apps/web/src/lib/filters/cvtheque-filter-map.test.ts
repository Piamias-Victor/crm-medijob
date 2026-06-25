// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  normalizeCvthequeFilterValues,
  toCandidateListFilters,
} from '@/lib/filters/cvtheque-filter-map'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import { buildCvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'

const config = buildCvthequeFilterConfig({
  jobTitles: [{ id: 'jt1', name: 'Pharmacien' }],
  softwares: [],
  recruiters: [],
})
const defaults = buildDefaultFilterValues(config)

describe('normalizeCvthequeFilterValues', () => {
  it('efface mission active si disponible oui', () => {
    const next = normalizeCvthequeFilterValues(
      { ...defaults, disponible: true, missionActive: true },
      defaults,
    )
    expect(next.missionActive).toBeNull()
  })
})

describe('toCandidateListFilters', () => {
  it('mappe disponible sans city', () => {
    expect(
      toCandidateListFilters({ ...defaults, disponible: true, metier: ['jt1'] }),
    ).toEqual({ jobTitleIds: ['jt1'], available: true })
  })
})
