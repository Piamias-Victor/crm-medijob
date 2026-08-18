import { describe, expect, it } from 'vitest'
import { parseCloseMapping } from '@/view-models/interview-close-mapping'
import { INTERVIEW_CRITERION_OPTIONS } from '@/view-models/interview-template-meta-options'
import { INTERVIEW_TEMPLATE_CRITERION_NONE } from '@/view-models/interview-template-admin-copy'

describe('interview template meta options', () => {
  it('keeps the B/C scoring catalog without a create slot', () => {
    expect(INTERVIEW_CRITERION_OPTIONS[0]).toEqual({
      value: '',
      label: INTERVIEW_TEMPLATE_CRITERION_NONE,
    })
    expect(INTERVIEW_CRITERION_OPTIONS.some((option) => option.value === 'B1')).toBe(true)
    expect(INTERVIEW_CRITERION_OPTIONS.some((option) => option.value === 'C5')).toBe(true)
  })

  it('parses known close mappings and falls back to none', () => {
    expect(parseCloseMapping('salary')).toBe('salary')
    expect(parseCloseMapping('unknown')).toBe('none')
  })
})
