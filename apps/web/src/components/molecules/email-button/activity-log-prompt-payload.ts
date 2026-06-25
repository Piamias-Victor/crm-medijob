import type { ActivityLogScope } from '@/view-models/activity-log.types'

export type ActivityLogPromptPayload = {
  scopes: ActivityLogScope[]
  defaultContent: string
}
