import type { ResponseKind } from './schemas'
import { CHAT_PERSONA_RULES } from './chat-persona'

const FORMAT_HINTS: Record<ResponseKind, string> = {
  chat: '{"reply": string}',
  summary: '{"summary": string}',
  email: '{"subject": string, "body": string}',
  offer: '{"title": string, "content": string (au moins 100 caractères)}',
  report: '{"report": string}',
  anonymized:
    '{"accroche","metierExperience","competencesLogiciels","mobilite","disponibiliteContrat","pointsForts": strings sans PII}',
  cv: '{"firstName": string, "lastName": string, ... champs CV optionnels}',
  commentIntake:
    '{"softwares"?: string[], "availableFrom"?: string, "mobilityRadiusKm"?: number, "mobilityNotes"?: string}',
}

export type PromptParts = {
  kind: ResponseKind
  message?: string
  instruction?: string
  contextText?: string | null
  historyText?: string | null
}

export function buildPrompt({
  kind,
  message,
  instruction,
  contextText,
  historyText,
}: PromptParts): string {
  const lines = [
    'Tu es un assistant de recrutement médical pour le CRM MediJob.',
    `Réponds STRICTEMENT en JSON valide respectant ce format : ${FORMAT_HINTS[kind]}.`,
    'N’ajoute aucun texte en dehors du JSON.',
  ]
  if (kind === 'chat') {
    lines.push('', 'Règles free-chat :', CHAT_PERSONA_RULES)
  }
  if (contextText) lines.push('', 'Contexte :', contextText)
  if (historyText) lines.push('', 'Historique récent :', historyText)
  if (instruction) lines.push('', 'Tâche :', instruction)
  if (message) lines.push('', 'Message :', message)
  return lines.join('\n')
}
