import { INTERVIEW_GENERIC_PROFILE_KEY } from '../../src/view-models/interview-profile-key'

const answers = [
  { label: 'En recherche', text: 'En recherche active.', points: 4, tone: 'ok' },
  { label: 'En poste', text: 'Actuellement en poste.', points: 8, tone: 'good' },
  { label: 'Indépendant / autre', text: 'Statut indépendant ou autre.', points: 6, tone: 'ok' },
]

const sections = [
  {
    id: 'parcours',
    title: 'Parcours & situation',
    hint: 'B1',
    questions: [
      {
        id: 'gen_q1',
        question: 'Quelle est votre situation professionnelle actuelle ?',
        suggestedAnswers: answers,
        mainCritere: 'B1',
      },
      {
        id: 'gen_q2',
        question: 'Quel métier ou environnement visez-vous ?',
        suggestedAnswers: [
          { label: 'Officine', text: 'Officine.', points: 8, tone: 'good' },
          { label: 'Autre santé', text: 'Autre métier de santé.', points: 6, tone: 'ok' },
          { label: 'À préciser', text: 'Projet à préciser.', points: 4, tone: 'ok' },
        ],
      },
    ],
  },
  {
    id: 'dispo',
    title: 'Disponibilités & mobilité',
    questions: [
      {
        id: 'gen_q3',
        question: 'Quand êtes-vous disponible ?',
        suggestedAnswers: [
          { label: 'Immédiate', text: 'Disponible immédiatement.', points: 12, tone: 'excellent' },
          { label: 'Sous 1 mois', text: 'Disponible sous un mois.', points: 8, tone: 'good' },
          { label: 'Plus tard', text: 'Disponibilité plus lointaine.', points: 4, tone: 'ok' },
        ],
      },
      {
        id: 'gen_q4',
        question: 'Quelle mobilité (distance, véhicule) ?',
        suggestedAnswers: [
          { label: 'Véhicule + large', text: 'Véhicule, rayon large.', points: 12, tone: 'excellent' },
          { label: 'Local', text: 'Mobilité locale.', points: 6, tone: 'ok' },
          { label: 'À préciser', text: 'Mobilité à préciser.', points: 4, tone: 'ok' },
        ],
      },
    ],
  },
  {
    id: 'motivation',
    title: 'Motivation & projet',
    hint: 'B7',
    questions: [
      {
        id: 'gen_q5',
        question: 'Pourquoi Medijob et quel projet ?',
        suggestedAnswers: [
          { label: 'Projet clair', text: 'Projet et motivation clairs.', points: 12, tone: 'excellent' },
          { label: 'Ouvert', text: 'Ouvert, projet à affiner.', points: 8, tone: 'good' },
          { label: 'Flou', text: 'Projet encore flou.', points: 4, tone: 'ok' },
        ],
      },
    ],
  },
]

export const GENERIC_INTERVIEW_TEMPLATES = [
  {
    profileKey: INTERVIEW_GENERIC_PROFILE_KEY,
    mode: 'INTERIM' as const,
    version: 1,
    label: 'Autre',
    sections,
  },
  {
    profileKey: INTERVIEW_GENERIC_PROFILE_KEY,
    mode: 'CDD_CDI' as const,
    version: 1,
    label: 'Autre',
    sections,
  },
]
