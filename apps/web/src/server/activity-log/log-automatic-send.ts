import type { ActivityType, DocumentEntityType } from '@prisma/client'

export type AutomaticSendTarget = {
  entityType: DocumentEntityType
  entityId: string
}

export type LogAutomaticSendInput = {
  type: 'SMS' | 'EMAIL'
  content: string
  targets: AutomaticSendTarget[]
}

export type LogAutomaticSend = (input: LogAutomaticSendInput) => Promise<void>

type AutomaticSendDeps = {
  ensureAuthor: () => Promise<{ id: string }>
  createBatch: (
    inputs: Array<{
      entityType: DocumentEntityType
      entityId: string
      authorId: string
      type: ActivityType
      content?: string
    }>,
  ) => Promise<unknown>
}

export function makeLogAutomaticSend(deps: AutomaticSendDeps): LogAutomaticSend {
  return async (input) => {
    if (input.targets.length === 0) return
    try {
      const author = await deps.ensureAuthor()
      await deps.createBatch(
        input.targets.map((target) => ({
          ...target,
          authorId: author.id,
          type: input.type,
          content: input.content,
        })),
      )
    } catch {
      // Best-effort: outbound send already succeeded.
    }
  }
}
