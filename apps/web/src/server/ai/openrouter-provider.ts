import type { AssistantProvider, AssistantRequest } from './provider.types'

export const DEFAULT_MODEL = 'google/gemini-2.5-flash-lite'

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

type OpenRouterResponse = {
  choices?: { message?: { content?: string } }[]
}

export function createOpenRouterProvider(apiKey: string, model: string): AssistantProvider {
  return {
    async complete({ prompt }: AssistantRequest) {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
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
