import { buildPrompt } from './prompt'
import { parseAssistantResponse } from './parse'
import type { AssistantProvider } from './provider'
import type { SummaryResponse } from './schemas'

export type CandidateSummaryInput = {
  notes: string | null
  jobTitleName: string
  softwareNames: string[]
}

export function buildCandidateSummaryPrompt(input: CandidateSummaryInput): string {
  const context = [
    `Métier : ${input.jobTitleName}`,
    input.softwareNames.length > 0 ? `Logiciels : ${input.softwareNames.join(', ')}` : null,
    input.notes ? `Notes et expérience :\n${input.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  return buildPrompt({
    kind: 'summary',
    instruction:
      'Rédige un résumé professionnel en markdown (français) pour un recruteur médical. Synthétise expérience, compétences et points forts. Pas de coordonnées personnelles.',
    contextText: context,
  })
}

export async function runCandidateSummary(
  provider: AssistantProvider,
  input: CandidateSummaryInput,
): Promise<string> {
  const prompt = buildCandidateSummaryPrompt(input)
  const raw = await provider.complete({ prompt, kind: 'summary' })
  const data = parseAssistantResponse('summary', raw) as SummaryResponse
  return data.summary
}
