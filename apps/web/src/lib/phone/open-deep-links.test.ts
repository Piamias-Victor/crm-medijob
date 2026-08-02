import { describe, expect, it, vi, afterEach } from 'vitest'
import { openDeepLinks } from '@/lib/phone/open-deep-links'

describe('openDeepLinks', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens each url in a new tab', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    openDeepLinks(['sms:+33612345678', 'https://wa.me/33612345678'])
    expect(open).toHaveBeenCalledTimes(2)
    expect(open).toHaveBeenNthCalledWith(1, 'sms:+33612345678', '_blank', 'noopener,noreferrer')
    expect(open).toHaveBeenNthCalledWith(
      2,
      'https://wa.me/33612345678',
      '_blank',
      'noopener,noreferrer',
    )
  })
})
