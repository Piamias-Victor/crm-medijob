import { parseAssistantResponse } from '@/server/ai/parse'
import type { AssistantProvider } from '@/server/ai/provider'
import { emailResponseSchema, type EmailResponse } from '@/server/ai/schemas'
import {
  buildPresentCandidatePrompt,
  type PresentCandidateInput,
} from '@/server/ai/present-candidate-prompt'

export type { PresentCandidateInput } from '@/server/ai/present-candidate-prompt'
export type PresentCandidateEmail = EmailResponse

export async function runPresentCandidateEmail(
  provider: AssistantProvider,
  input: PresentCandidateInput,
): Promise<PresentCandidateEmail> {
  const prompt = buildPresentCandidatePrompt(input)
  const raw = await provider.complete({ prompt, kind: 'email' })
  return emailResponseSchema.parse(parseAssistantResponse('email', raw))
}
