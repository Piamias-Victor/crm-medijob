export const INTERVIEW_TEMPLATE_DUPLICATE_MAPPING =
  'Deux questions partagent le même mapping fiche (hors « aucun »).'
export const INTERVIEW_TEMPLATE_SAVE_SUCCESS = 'Copie de travail enregistrée'
export const INTERVIEW_TEMPLATE_PUBLISH_SUCCESS = 'Trame publiée'
export const INTERVIEW_TEMPLATE_NOT_FOUND = 'Trame introuvable'
export const INTERVIEW_TEMPLATE_TITLE = 'Trames d’entretien'
export const INTERVIEW_TEMPLATE_HINT =
  'Copie de travail par métier × mode. Publier crée une nouvelle version ; les brouillons ouverts restent pinnés.'
export const INTERVIEW_TEMPLATE_METIERS_HINT =
  'Référentiel des métiers. Chaque carte ouvre les deux trames d’entretien.'
export const INTERVIEW_TEMPLATE_SAVE = 'Enregistrer'
export const INTERVIEW_TEMPLATE_PUBLISH = 'Publier'
export const INTERVIEW_TEMPLATE_ADD_SECTION = 'Ajouter une section'
export const INTERVIEW_TEMPLATE_ADD_QUESTION = 'Ajouter une question'
export const INTERVIEW_TEMPLATE_ADD_ANSWER = 'Ajouter une réponse'
export const INTERVIEW_TEMPLATE_MAPPING = 'Mapping fiche'
export const INTERVIEW_TEMPLATE_CRITERION = 'Critère'
export const INTERVIEW_TEMPLATE_CRITERION_NONE = 'Aucun'
export const INTERVIEW_TEMPLATE_POINTS = 'Points'
export const INTERVIEW_TEMPLATE_LABEL = 'Libellé'
export const INTERVIEW_TEMPLATE_ANSWER_LABEL = 'Libellé chip'
export const INTERVIEW_TEMPLATE_ANSWER_TEXT = 'Texte recruteur'
export const INTERVIEW_TEMPLATE_ANSWER_HINT =
  'Libellé chip = bouton pendant l’entretien. Texte recruteur = phrase type pour la note / le PDF.'
export const INTERVIEW_TEMPLATE_EMPTY = 'Aucune trame publiée'
export const INTERVIEW_TEMPLATE_EMPTY_HINT = 'Les couples métier × mode apparaissent après le seed.'
export const INTERVIEW_TEMPLATE_BACK = 'Retour aux métiers'
export const INTERVIEW_TEMPLATE_REMOVE = 'Supprimer'
export const INTERVIEW_TEMPLATE_SECTION_FALLBACK = 'Nouvelle section'
export const INTERVIEW_TEMPLATE_QUESTION_FALLBACK = 'Nouvelle question'

export function interviewTemplateQuestionCount(count: number) {
  return count <= 1 ? `${count} question` : `${count} questions`
}
