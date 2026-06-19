import { DEFAULT_MODEL } from '@/server/ai/openrouter-provider'
import {
  buildCvExtractionPromptForFile,
  buildCvOpenRouterMessages,
} from '@/server/ai/openrouter-cv-prompt'
import type { CvExtractionProvider, CvExtractionFileInput } from '@/server/ai/cv-extraction-provider'

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

type OpenRouterResponse = {
  choices?: { message?: { content?: string } }[]
}

export function createOpenRouterCvProvider(apiKey: string, model: string): CvExtractionProvider {
  return {
    async extract(file: CvExtractionFileInput) {
      const prompt = buildCvExtractionPromptForFile(file.filename)
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: buildCvOpenRouterMessages(prompt, file),
          response_format: { type: 'json_object' },
        }),
      })
      if (!res.ok) throw new Error('OPENROUTER_REQUEST_FAILED')
      const data = (await res.json()) as OpenRouterResponse
      const text = data.choices?.[0]?.message?.content
      if (!text) throw new Error('OPENROUTER_EMPTY_RESPONSE')
      return text
    },
  }
}

export { DEFAULT_MODEL }
