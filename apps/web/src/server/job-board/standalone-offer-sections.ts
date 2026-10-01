import type { OfferSections } from '@/server/job-board/offer-section-titles'

export type StandaloneOfferSectionInput = {
  jobTitleName: string
  city: string
  postalCode?: string | null
  contractType: string
  tempsPlein: boolean
}

export function buildStandaloneOfferSections(
  input: StandaloneOfferSectionInput,
): OfferSections {
  const metier = input.jobTitleName.trim()
  const ville = input.city.trim()
  const cp = input.postalCode?.trim()
  const lieu = cp ? `${ville} (${cp})` : ville
  const temps = input.tempsPlein ? 'Temps plein' : 'Temps partiel'

  return {
    resume: `Nous recrutons pour l’un de nos clients, une officine située à ${lieu}, un(e) ${metier} en ${input.contractType}.`,
    missions: [
      'Accueillir, conseiller et accompagner les patients au comptoir',
      'Préparer et délivrer les médicaments sous la responsabilité du pharmacien',
      'Participer à la gestion des stocks et au bon fonctionnement de l’officine',
    ],
    profil: [
      `Profil ${metier} adapté au poste`,
      'À l’aise dans la relation patient et le travail en équipe',
      'Connaissance d’un logiciel d’officine appréciée',
    ],
    infos: [
      `${input.contractType} — ${temps}`,
      `Localisation : ${lieu}`,
      'Rémunération selon profil',
    ],
  }
}
