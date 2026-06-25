import { buildPrompt } from '@/server/ai/prompt'
import { formatPresentCandidate } from '@/server/ai/format-entity'

export type PresentCandidateRadiusInput = {
  candidate: Parameters<typeof formatPresentCandidate>[0]
}

export function buildPresentCandidateRadiusPrompt(input: PresentCandidateRadiusInput): string {
  return buildPrompt({
    kind: 'email',
    instruction:
      'Rédige un email professionnel en français pour présenter ce candidat à plusieurs officines. Ton chaleureux, concis, générique — ne cite aucune pharmacie ni aucun nom d’officine.',
    contextText: formatPresentCandidate(input.candidate),
  })
}
