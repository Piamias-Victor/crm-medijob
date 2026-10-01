import { describe, expect, it } from 'vitest'
import { renderOfferSectionsHtml } from '@/server/job-board/render-offer-sections'
import { OFFER_SECTION_TITLES } from '@/server/job-board/offer-section-titles'

describe('renderOfferSectionsHtml titles', () => {
  it('marks section titles as non-editable so typing stays normal weight', () => {
    const html = renderOfferSectionsHtml({
      resume: 'Texte',
      missions: ['A'],
      profil: ['B'],
      infos: ['C'],
    })
    for (const title of OFFER_SECTION_TITLES) {
      expect(html).toContain(
        `<p contenteditable="false"><strong>${title}</strong></p>`,
      )
    }
  })
})
