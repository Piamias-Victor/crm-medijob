import { randomBytes } from 'crypto'
import { hashPassword } from '@/server/auth/password'
import { activityLogRepository } from '@/server/db/repositories/activity-log.repository'
import { automaticAuthorRepository } from '@/server/db/repositories/automatic-author.repository'
import { makeLogAutomaticSend } from '@/server/activity-log/log-automatic-send'

export const defaultLogAutomaticSend = makeLogAutomaticSend({
  ensureAuthor: () =>
    automaticAuthorRepository.ensure(() =>
      hashPassword(randomBytes(32).toString('hex')),
    ),
  createBatch: (inputs) => activityLogRepository.createBatch(inputs),
})
