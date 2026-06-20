import type { AssistantProvider, AssistantRequest } from './provider.types'
import type { ResponseKind } from './schemas'
import { buildMockSummary } from './mock-summary'

const FILLER =
  'Contenu généré en mode simulation pour permettre les tests sans clé API Gemini. '

function buildMatchingMock(prompt: string) {
  const ids = [...prompt.matchAll(/id=([^\s\n]+)/g)].map((match) => match[1]!)
  return ids.map((candidateId, index) => ({
    candidateId,
    score: Math.max(55, 92 - index * 7),
    justification: `Score simulé — profil ${index + 1} compatible avec la mission.`,
  }))
}

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
  complete: ({ kind, prompt }: AssistantRequest) => {
    if (kind === 'matching') return Promise.resolve(JSON.stringify(buildMatchingMock(prompt)))
    return Promise.resolve(JSON.stringify(builders[kind](prompt)))
  },
}
