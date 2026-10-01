import { describe, expect, it } from 'vitest'
import { stubStandaloneContent } from '@/server/routers/job-offer-standalone'
import { OFFER_SECTION_TITLES } from '@/server/job-board/offer-section-titles'

describe('stubStandaloneContent', () => {
  it('seeds four bold section titles for natural editing', () => {
    const html = stubStandaloneContent('CDI', true)
    for (const title of OFFER_SECTION_TITLES) {
      expect(html).toContain(`<p><strong>${title}</strong></p>`)
    }
    expect(html).not.toContain('À préciser')
    expect(html).not.toContain('Description à compléter')
  })
})
