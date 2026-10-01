import { escapeHtml } from '@/server/job-board/escape-html'
import {
  OFFER_SECTION_TITLES,
  type OfferSections,
} from '@/server/job-board/offer-section-titles'

function titleHtml(title: string) {
  return `<p contenteditable="false"><strong>${escapeHtml(title)}</strong></p>`
}

function paragraphHtml(text: string) {
  return `<p>${escapeHtml(text)}</p>`
}

function listHtml(items: string[]) {
  if (items.length === 0) return '<p></p>'
  const lis = items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
  return `<ul>${lis}</ul>`
}

export function renderOfferSectionsHtml(sections: OfferSections): string {
  const [resumeT, missionsT, profilT, infosT] = OFFER_SECTION_TITLES
  return [
    titleHtml(resumeT),
    sections.resume.trim() ? paragraphHtml(sections.resume) : '<p></p>',
    titleHtml(missionsT),
    listHtml(sections.missions),
    titleHtml(profilT),
    listHtml(sections.profil),
    titleHtml(infosT),
    listHtml(sections.infos),
  ].join('')
}
