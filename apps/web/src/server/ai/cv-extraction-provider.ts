import { mockProvider } from '@/server/ai/mock-provider'
import { createOpenRouterCvProvider, DEFAULT_MODEL } from '@/server/ai/openrouter-cv-provider'

export type CvExtractionFileInput = {
  filename: string
  mimeType: string
  dataBase64: string
}

export interface CvExtractionProvider {
  extract(file: CvExtractionFileInput): Promise<string>
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

const mockCvProvider: CvExtractionProvider = {
  extract: (file) => mockProvider.complete({ kind: 'cv', prompt: file.filename }),
}

export function createCvExtractionProvider(
  env: ProviderEnv = envFromProcess(),
): CvExtractionProvider {
  if (env.EXTRACTION_PROVIDER !== 'mock' && env.OPENROUTER_API_KEY) {
    return createOpenRouterCvProvider(env.OPENROUTER_API_KEY, env.EXTRACTION_MODEL ?? DEFAULT_MODEL)
  }
  return mockCvProvider
}
