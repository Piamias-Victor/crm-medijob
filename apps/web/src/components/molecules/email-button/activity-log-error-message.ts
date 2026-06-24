import { TRPCClientError } from '@trpc/client'
import { ACTIVITY_LOG_AUTH_ERROR, ACTIVITY_LOG_ERROR } from '@/components/molecules/email-button/email-button-copy'

export function activityLogErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError && error.data?.code === 'UNAUTHORIZED') {
    return ACTIVITY_LOG_AUTH_ERROR
  }
  return ACTIVITY_LOG_ERROR
}
