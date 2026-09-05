import { describe, expect, it } from 'vitest'
import { resolveAvailabilityLinkTestPhone } from './availability-link-test-phone'

describe('resolveAvailabilityLinkTestPhone', () => {
  it('has no override when env is unset', () => {
    expect(resolveAvailabilityLinkTestPhone({ NODE_ENV: 'test' })).toBeUndefined()
  })

  it('routes every availability SMS to the tester phone when env is set', () => {
    expect(
      resolveAvailabilityLinkTestPhone({
        NODE_ENV: 'test',
        AVAILABILITY_LINK_TEST_PHONE: ' 06 12 34 56 78 ',
      }),
    ).toBe('06 12 34 56 78')
  })

  it('disables the override when env is blank', () => {
    expect(
      resolveAvailabilityLinkTestPhone({ NODE_ENV: 'test', AVAILABILITY_LINK_TEST_PHONE: '  ' }),
    ).toBeUndefined()
  })
})
