import { describe, it, expect, vi, afterEach } from 'vitest'
import { openEmailCompose } from '@/lib/mailto/open-email-compose'

describe('openEmailCompose', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false when Gmail popups are blocked', () => {
    vi.stubGlobal('open', vi.fn(() => null))

    expect(openEmailCompose('https://mail.google.com/mail/?view=cm&fs=1&to=a@b.com', 'gmail')).toBe(false)
  })

  it('returns true when Gmail opens successfully', () => {
    vi.stubGlobal('open', vi.fn(() => ({}) as Window))

    expect(openEmailCompose('https://mail.google.com/mail/?view=cm&fs=1&to=a@b.com', 'gmail')).toBe(true)
  })
})
