import type { AssistantProvider, AssistantRequest } from './provider'
import type { ResponseKind } from './schemas'
import { buildMockSummary } from './mock-summary'

const FILLER =
  'Contenu généré en mode simulation pour permettre les tests sans clé API Gemini. '

const builders: Record<ResponseKind, (prompt: string) => object> = {
  chat: (prompt) => ({ reply: `Réponse simulée. ${prompt}` }),
  summary: (prompt) => ({ summary: buildMockSummary(prompt) }),
  email: (prompt) => ({ subject: 'Brouillon (simulation)', body: `Bonjour,\n\n${prompt}` }),
  offer: (prompt) => ({ title: 'Offre (simulation)', content: `${prompt}\n\n${FILLER.repeat(2)}` }),
  report: (prompt) => ({ report: `Rapport simulé.\n\n${prompt}` }),
  anonymized: () => ({
    profile:
      '## Profil anonymisé\n\nProfessionnel de santé expérimenté en officine. Maîtrise des logiciels métier. Mobilité régionale. Disponibilité immédiate.',
  }),
  cv: () => ({
    firstName: 'Camille',
    lastName: 'Durand',
    email: 'camille.durand@example.com',
    phone: '06 12 34 56 78',
    address: '12 rue de la République',
    city: 'Lyon',
    postalCode: '69001',
    jobTitle: 'Pharmacien',
    softwares: ['Winpharma'],
    preferredContractTypes: ['CDI'],
    availableFrom: '2026-07-01T00:00:00.000Z',
    mobilityNotes: 'Mobilité 30 km autour de Lyon',
    profileSummary:
      'Pharmacienne avec 5 ans d’expérience en officine de quartier. Maîtrise Winpharma et accueil patient.',
    rawText:
      'Camille Durand · camille.durand@example.com · 06 12 34 56 78 · 69001 Lyon · Pharmacien',
  }),
}

export const mockProvider: AssistantProvider = {
  complete: ({ kind, prompt }: AssistantRequest) =>
    Promise.resolve(JSON.stringify(builders[kind](prompt))),
}
