import type { ResponseKind } from './schemas'

const FORMAT_HINTS: Record<ResponseKind, string> = {
  chat: '{"reply": string}',
  summary: '{"summary": string}',
  email: '{"subject": string, "body": string}',
  offer: '{"title": string, "content": string (au moins 100 caractères)}',
  report: '{"report": string}',
  cv: '{"firstName": string, "lastName": string, ... champs CV optionnels}',
}

export type PromptParts = {
  kind: ResponseKind
  message?: string
  instruction?: string
  contextText?: string | null
}

export function buildPrompt({ kind, message, instruction, contextText }: PromptParts): string {
  const lines = [
    'Tu es un assistant de recrutement médical pour le CRM MediJob.',
    `Réponds STRICTEMENT en JSON valide respectant ce format : ${FORMAT_HINTS[kind]}.`,
    'N’ajoute aucun texte en dehors du JSON.',
  ]
  if (contextText) lines.push('', 'Contexte :', contextText)
  if (instruction) lines.push('', 'Tâche :', instruction)
  if (message) lines.push('', 'Message :', message)
  return lines.join('\n')
}
