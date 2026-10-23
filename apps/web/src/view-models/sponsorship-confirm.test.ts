import { describe, expect, it } from 'vitest'
import { isTransferRequiredError } from '@/view-models/sponsorship-confirm'

describe('isTransferRequiredError', () => {
  it('detects transfer conflict code', () => {
    expect(isTransferRequiredError(new Error('SPONSORSHIP_TRANSFER_REQUIRED'))).toBe(true)
    expect(isTransferRequiredError(new Error('other'))).toBe(false)
  })
})
