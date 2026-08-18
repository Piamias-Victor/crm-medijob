import { describe, expect, it } from 'vitest'
import { interviewTemplateEditorHref, jobTitleTrameKind } from '@/view-models/job-title-trame-cards'

describe('interviewTemplateEditorHref', () => {
  it('points Autre to the generic trame', () => {
    expect(interviewTemplateEditorHref(null, 'CDD_CDI')).toBe('/admin/metiers/generique/CDD_CDI')
  })

  it('keeps a dedicated profileKey', () => {
    expect(interviewTemplateEditorHref('conseiller_para', 'INTERIM')).toBe(
      '/admin/metiers/conseiller_para/INTERIM',
    )
  })
})

describe('jobTitleTrameKind', () => {
  it('creates when the job title has no profileKey', () => {
    expect(jobTitleTrameKind(null, 'INTERIM', [])).toBe('create')
  })

  it('edits an active dedicated pair and creates after archive', () => {
    const pairs = [{ profileKey: 'pharmacien', mode: 'INTERIM' as const, archived: false }]
    expect(jobTitleTrameKind('pharmacien', 'INTERIM', pairs)).toBe('edit')
    expect(jobTitleTrameKind('pharmacien', 'INTERIM', [{ ...pairs[0]!, archived: true }])).toBe(
      'create',
    )
  })
})
