import { activityLogRepository } from '@/server/db/repositories/activity-log.repository'
import { makeLogEntityLifecycle } from '@/server/activity-log/log-entity-lifecycle'

export const defaultLogLifecycle = makeLogEntityLifecycle((input) =>
  activityLogRepository.create(input),
)
