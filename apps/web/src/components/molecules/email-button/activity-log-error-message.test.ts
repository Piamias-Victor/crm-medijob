import { describe, it, expect } from 'vitest'
import { TRPCClientError } from '@trpc/client'
import { activityLogErrorMessage } from '@/components/molecules/email-button/activity-log-error-message'
import {
  ACTIVITY_LOG_AUTH_ERROR,
  ACTIVITY_LOG_ERROR,
} from '@/components/molecules/email-button/email-button-copy'

describe('activityLogErrorMessage', () => {
  it('returns an auth-specific message for unauthorized mutations', () => {
    const error = Object.assign(new TRPCClientError('Unauthorized'), {
      data: { code: 'UNAUTHORIZED' as const },
    })

    expect(activityLogErrorMessage(error)).toBe(ACTIVITY_LOG_AUTH_ERROR)
  })

  it('returns a generic message for other failures', () => {
    expect(activityLogErrorMessage(new Error('network'))).toBe(ACTIVITY_LOG_ERROR)
  })
})
