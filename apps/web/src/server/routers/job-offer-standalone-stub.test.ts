import { describe, expect, it } from 'vitest'
import { stubStandaloneContent } from '@/server/routers/job-offer-standalone'
import { OFFER_SECTION_TITLES } from '@/server/job-board/offer-section-titles'

describe('stubStandaloneContent', () => {
  it('seeds bold non-editable titles and prefilled body from métier/ville/contrat', () => {
    const html = stubStandaloneContent({
      jobTitleName: 'Préparateur en Pharmacie',
      city: 'Nice',
      postalCode: '06000',
      contractType: 'CDI',
      tempsPlein: true,
    })
    for (const title of OFFER_SECTION_TITLES) {
      expect(html).toContain(
        `<p contenteditable="false"><strong>${title}</strong></p>`,
      )
    }
    expect(html).toContain('Nice')
    expect(html).toContain('Préparateur en Pharmacie')
    expect(html).toContain('CDI')
  })
})
