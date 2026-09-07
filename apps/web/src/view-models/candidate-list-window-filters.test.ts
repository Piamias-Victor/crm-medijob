import { describe, expect, it } from 'vitest'
import { mergeCandidateListWindowFilters } from '@/view-models/candidate-list-window-filters'

describe('mergeCandidateListWindowFilters', () => {
  it('keeps the Accueil 24 h Badakan window on top of bar filters', () => {
    expect(
      mergeCandidateListWindowFilters(
        { jobTitleIds: ['jt1'] },
        { validatedWithinHours: 24 },
      ),
    ).toEqual({ jobTitleIds: ['jt1'], validatedWithinHours: 24 })
  })
})
