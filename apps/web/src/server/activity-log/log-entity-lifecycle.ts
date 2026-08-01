import type { DocumentEntityType } from '@prisma/client'
import {
  ACTIVITY_LOG_CREATED_CONTENT,
  activityLogUpdatedContent,
  resolveAuthorLabel,
} from '@/lib/constants/activity-log-lifecycle'

export type LifecycleActor = {
  id: string
  name?: string | null
  email?: string | null
}

export type LogEntityLifecycleInput = {
  action: 'created' | 'updated'
  entityType: DocumentEntityType
  entityId: string
  user: LifecycleActor
}

export type LogEntityLifecycle = (input: LogEntityLifecycleInput) => Promise<void>

type LifecycleCreate = (input: {
  entityType: DocumentEntityType
  entityId: string
  authorId: string
  type: 'NOTE'
  content: string
}) => Promise<unknown>

export function makeLogEntityLifecycle(create: LifecycleCreate): LogEntityLifecycle {
  return async (input) => {
    const content =
      input.action === 'created'
        ? ACTIVITY_LOG_CREATED_CONTENT
        : activityLogUpdatedContent(resolveAuthorLabel(input.user))
    try {
      await create({
        entityType: input.entityType,
        entityId: input.entityId,
        authorId: input.user.id,
        type: 'NOTE',
        content,
      })
    } catch {
      // Best-effort: entity write already succeeded.
    }
  }
}
