import type { ResponseKind } from './schemas'
import { mockProvider } from './mock-provider'
import { createOpenRouterProvider, DEFAULT_MODEL } from './openrouter-provider'

export type AssistantRequest = { prompt: string; kind: ResponseKind }

export interface AssistantProvider {
  complete(request: AssistantRequest): Promise<string>
}

type ProviderEnv = {
  EXTRACTION_PROVIDER?: string
  OPENROUTER_API_KEY?: string
  EXTRACTION_MODEL?: string
}

const envFromProcess = (): ProviderEnv => ({
  EXTRACTION_PROVIDER: process.env.EXTRACTION_PROVIDER,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  EXTRACTION_MODEL: process.env.EXTRACTION_MODEL,
})

export function createAssistantProvider(env: ProviderEnv = envFromProcess()): AssistantProvider {
  if (env.EXTRACTION_PROVIDER !== 'mock' && env.OPENROUTER_API_KEY) {
    return createOpenRouterProvider(env.OPENROUTER_API_KEY, env.EXTRACTION_MODEL ?? DEFAULT_MODEL)
  }
  return mockProvider
}
