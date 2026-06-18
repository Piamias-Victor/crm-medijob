import type { AssistantProvider, AssistantRequest } from './provider'
import type { ResponseKind } from './schemas'

const FILLER =
  'Contenu généré en mode simulation pour permettre les tests sans clé API Gemini. '

const builders: Record<ResponseKind, (prompt: string) => object> = {
  chat: (prompt) => ({ reply: `Réponse simulée. ${prompt}` }),
  summary: (prompt) => ({ summary: `Résumé simulé. ${prompt}` }),
  email: (prompt) => ({ subject: 'Brouillon (simulation)', body: `Bonjour,\n\n${prompt}` }),
  offer: (prompt) => ({ title: 'Offre (simulation)', content: `${prompt}\n\n${FILLER.repeat(2)}` }),
  report: (prompt) => ({ report: `Rapport simulé.\n\n${prompt}` }),
}

export const mockProvider: AssistantProvider = {
  complete: ({ kind, prompt }: AssistantRequest) =>
    Promise.resolve(JSON.stringify(builders[kind](prompt))),
}
