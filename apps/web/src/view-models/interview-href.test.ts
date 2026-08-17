import { describe, expect, it } from 'vitest'
import { interviewDraftPath, interviewStartPath } from '@/view-models/interview-href'

describe('interview hrefs', () => {
  it('builds start and draft paths', () => {
    expect(interviewStartPath()).toBe('/candidats/entretiens/new')
    expect(interviewStartPath('c1')).toBe('/candidats/c1/entretiens/new')
    expect(interviewDraftPath('c1', 'i1')).toBe('/candidats/c1/entretiens/i1')
  })
})
