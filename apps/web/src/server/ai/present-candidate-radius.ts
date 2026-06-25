import { parseAssistantResponse } from '@/server/ai/parse'
import type { AssistantProvider } from '@/server/ai/provider'
import { emailResponseSchema, type EmailResponse } from '@/server/ai/schemas'
import {
  buildPresentCandidateRadiusPrompt,
  type PresentCandidateRadiusInput,
} from '@/server/ai/present-candidate-radius-prompt'

export type PresentCandidateRadiusEmail = EmailResponse

export async function runPresentCandidateRadiusEmail(
  provider: AssistantProvider,
  input: PresentCandidateRadiusInput,
): Promise<PresentCandidateRadiusEmail> {
  const prompt = buildPresentCandidateRadiusPrompt(input)
  const raw = await provider.complete({ prompt, kind: 'email' })
  return emailResponseSchema.parse(parseAssistantResponse('email', raw))
}
