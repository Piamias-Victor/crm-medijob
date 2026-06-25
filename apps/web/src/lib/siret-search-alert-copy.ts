import type { SiretSearchFeedback } from '@/hooks/use-pharmacy-siret-search'

const NO_MATCH_MSG = 'Aucune officine trouvée dans l’annuaire pour cette recherche.'

export function siretSearchAlertTitle(feedback: SiretSearchFeedback): string {
  if (feedback.variant === 'error') return 'Recherche indisponible'
  if (feedback.message === NO_MATCH_MSG) return 'Aucun résultat'
  return 'Recherche annuaire'
}
