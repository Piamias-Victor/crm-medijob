import { describe, expect, it } from 'vitest'
import { renderOfferSectionsHtml } from '@/server/job-board/render-offer-sections'
import { OFFER_SECTION_TITLES } from '@/server/job-board/offer-section-titles'

const sections = {
  resume: 'Officine dynamique à Lyon.',
  missions: ['Accueillir les patients', 'Gérer le stock'],
  profil: ['BP préparateur', 'Esprit d’équipe'],
  infos: ['CDI temps plein', 'Rémunération selon profil'],
}

describe('renderOfferSectionsHtml', () => {
  it('emits exactly four titled sections in order', () => {
    const html = renderOfferSectionsHtml(sections)
    for (const title of OFFER_SECTION_TITLES) {
      expect(html).toContain(`<p><strong>${title}</strong></p>`)
    }
    const indexes = OFFER_SECTION_TITLES.map((t) => html.indexOf(t))
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b))
  })

  it('escapes text and only uses p strong ul li', () => {
    const html = renderOfferSectionsHtml({
      ...sections,
      resume: 'A <script>alert(1)</script> & "x"',
    })
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>')
    expect(html.replaceAll(/<\/?(p|strong|ul|li)>/g, '').includes('<')).toBe(false)
  })

  it('matches snapshot of happy-path HTML', () => {
    expect(renderOfferSectionsHtml(sections)).toMatchSnapshot()
  })
})
