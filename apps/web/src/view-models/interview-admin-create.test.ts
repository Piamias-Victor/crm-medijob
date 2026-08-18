import { describe, expect, it } from 'vitest'
import {
  interviewTemplateCopySourceOptions,
  parseInterviewTemplateSource,
} from '@/view-models/interview-admin-create'
import { INTERVIEW_TEMPLATE_EMPTY_SOURCE } from '@/view-models/interview-template-admin-copy'

describe('interviewTemplateCopySourceOptions', () => {
  it('puts the empty source first then published pairs', () => {
    const options = interviewTemplateCopySourceOptions([
      { profileKey: 'pharmacien', mode: 'INTERIM', label: 'Pharmacien(ne)' },
    ])
    expect(options[0]).toEqual({ value: '', label: INTERVIEW_TEMPLATE_EMPTY_SOURCE })
    expect(options[1]).toEqual({ value: 'pharmacien:INTERIM', label: 'Pharmacien(ne) · Intérim' })
  })
})

describe('parseInterviewTemplateSource', () => {
  it('treats an empty value as no copy', () => {
    expect(parseInterviewTemplateSource('')).toBeUndefined()
  })
})
