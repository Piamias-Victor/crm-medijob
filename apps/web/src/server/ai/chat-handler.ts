import { findShortcut } from './shortcuts'
import { loadContextText, type ContextRepos } from './context-loader'
import { buildPrompt } from './prompt'
import { parseAssistantResponse } from './parse'
import { renderResponse } from './render'
import type { AssistantProvider } from './provider'
import type { ChatInput } from './request'
import type { ResponseKind } from './schemas'

export type AssistantDeps = {
  provider: AssistantProvider
  repos: ContextRepos
}

export type AssistantResult = {
  kind: ResponseKind
  text: string
}

export async function runAssistantChat(
  input: ChatInput,
  deps: AssistantDeps,
): Promise<AssistantResult> {
  const shortcut = input.shortcutId ? findShortcut(input.shortcutId) : undefined
  if (input.shortcutId && !shortcut) throw new Error('UNKNOWN_SHORTCUT')

  const kind: ResponseKind = shortcut?.kind ?? 'chat'
  const contextText = await loadContextText(input.context, deps.repos)
  const prompt = buildPrompt({
    kind,
    message: input.message,
    instruction: shortcut?.instruction,
    contextText,
  })

  const raw = await deps.provider.complete({ prompt, kind })
  const data = parseAssistantResponse(kind, raw)
  return { kind, text: renderResponse(kind, data) }
}
