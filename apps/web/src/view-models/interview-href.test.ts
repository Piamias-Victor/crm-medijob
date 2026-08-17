import { describe, expect, it } from 'vitest'
import { interviewCandidateFichePath, interviewDraftPath, interviewStartPath } from '@/view-models/interview-href'

describe('interview hrefs', () => {
  it('builds start, draft and fiche paths', () => {
    expect(interviewStartPath()).toBe('/candidats/entretiens/new')
    expect(interviewStartPath('c1')).toBe('/candidats/c1/entretiens/new')
    expect(interviewDraftPath('c1', 'i1')).toBe('/candidats/c1/entretiens/i1')
    expect(interviewCandidateFichePath('c1')).toBe('/candidats/c1')
  })
})
