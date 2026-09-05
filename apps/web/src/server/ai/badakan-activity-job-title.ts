import { z } from 'zod'
import type { AssistantProvider } from '@/server/ai/provider'
import type { ReferentialEntry } from '@/server/badakan/resolve-referential'

const answerSchema = z.object({ jobTitleId: z.string().nullable() })

function buildPrompt(label: string, jobTitles: ReferentialEntry[]): string {
  const options = jobTitles.map((jobTitle) => `- ${jobTitle.id} : ${jobTitle.name}`).join('\n')
  return [
    'Tu rattaches un intitulé de poste en pharmacie à un métier du référentiel.',
    `Intitulé à rattacher : "${label}"`,
    'Métiers disponibles :',
    options,
    'Réponds en JSON strict : {"jobTitleId": "<id>"} ou {"jobTitleId": null} si aucun ne correspond.',
  ].join('\n')
}

function readAnswer(raw: string): string | null {
  try {
    const parsed = answerSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data.jobTitleId : null
  } catch {
    return null
  }
}

export function makeActivityJobTitleAsker(provider: AssistantProvider) {
  return async (label: string, jobTitles: ReferentialEntry[]): Promise<string | null> => {
    try {
      const raw = await provider.complete({
        prompt: buildPrompt(label, jobTitles),
        kind: 'matching',
      })
      return readAnswer(raw)
    } catch {
      return null
    }
  }
}
