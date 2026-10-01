import { renderOfferSectionsHtml } from '@/server/job-board/render-offer-sections'

export const SECTIONED_OFFER_HTML = renderOfferSectionsHtml({
  resume: 'Officine dynamique.',
  missions: ['Accueillir les patients'],
  profil: ['Diplôme requis'],
  infos: ['CDI temps plein'],
})

export const emptyStandaloneFields = {
  jobTitleName: null as string | null,
  city: null as string | null,
  postalCode: null as string | null,
  latitude: null as number | null,
  longitude: null as number | null,
  contractType: null as 'CDI' | null,
  tempsPlein: null as boolean | null,
  salaireMin: null as number | null,
  salaireMax: null as number | null,
  startDate: null as Date | null,
  profilRecherche: null as string | null,
}
