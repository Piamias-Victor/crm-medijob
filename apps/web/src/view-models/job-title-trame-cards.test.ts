import { describe, expect, it } from 'vitest'
import { interviewTemplateEditorHref } from '@/view-models/job-title-trame-cards'

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
