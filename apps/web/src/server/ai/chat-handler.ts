import { findShortcut } from './shortcuts'
import { loadContextText, type ContextRepos } from './context-loader'
import {
  loadShortcutExtraContext,
  type ShortcutContextDeps,
} from './assistant-shortcut-context'
import { buildPrompt } from './prompt'
import { parseAssistantResponse } from './parse'
import { renderResponse } from './render'
import { formatChatHistory, takeChatHistoryWindow } from './chat-history'
import type { AssistantProvider } from './provider'
import type { ChatInput } from './request'
import type { ResponseKind } from './schemas'

export type AssistantDeps = {
  provider: AssistantProvider
  repos: ContextRepos
} & ShortcutContextDeps

export type AssistantResult = {
  kind: ResponseKind
  text: string
}

function mergeContext(base: string | null, extra: string | null): string | null {
  if (base && extra) return `${base}\n\n${extra}`
  return base ?? extra
}

export async function runAssistantChat(
  input: ChatInput,
  deps: AssistantDeps,
): Promise<AssistantResult> {
  const shortcut = input.shortcutId ? findShortcut(input.shortcutId) : undefined
  if (input.shortcutId && !shortcut) throw new Error('UNKNOWN_SHORTCUT')

  const kind: ResponseKind = shortcut?.kind ?? 'chat'
  const entityText = await loadContextText(input.context, deps.repos)
  const extraText = await loadShortcutExtraContext(shortcut, input.context, deps)
  const history = takeChatHistoryWindow(input.history ?? [])
  const prompt = buildPrompt({
    kind,
    message: input.message,
    instruction: shortcut?.instruction,
    contextText: mergeContext(entityText, extraText),
    historyText: history.length > 0 ? formatChatHistory(history) : null,
  })

  const raw = await deps.provider.complete({ prompt, kind })
  const data = parseAssistantResponse(kind, raw)
  return { kind, text: renderResponse(kind, data) }
}
