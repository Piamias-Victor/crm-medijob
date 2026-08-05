// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { TRPCError } from '@trpc/server'
import { mapContactSoftDeleteError } from './contact-soft-delete-error'
import {
  PRIMARY_CONTACT_SOFT_DELETE_MESSAGE,
  PrimaryContactSoftDeleteError,
} from '@/server/db/repositories/contact-soft-delete'

describe('mapContactSoftDeleteError', () => {
  it('maps primary guard to PRECONDITION_FAILED', () => {
    expect(() => mapContactSoftDeleteError(new PrimaryContactSoftDeleteError())).toThrow(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: PRIMARY_CONTACT_SOFT_DELETE_MESSAGE,
      }),
    )
  })

  it('rethrows unknown errors', () => {
    expect(() => mapContactSoftDeleteError(new Error('boom'))).toThrow('boom')
  })
})
