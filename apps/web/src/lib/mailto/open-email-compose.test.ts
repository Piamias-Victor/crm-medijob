import { describe, it, expect, vi, afterEach } from 'vitest'
import { openEmailCompose } from '@/lib/mailto/open-email-compose'

describe('openEmailCompose', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('opens Gmail via a temporary anchor link', () => {
    const click = vi.fn()
    const remove = vi.fn()
    const anchor = { href: '', target: '', rel: '', click, remove } as unknown as HTMLAnchorElement
    const createElement = vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    const appendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => anchor)

    expect(openEmailCompose('https://mail.google.com/mail/?view=cm&fs=1&to=a@b.com', 'gmail')).toBe(true)
    expect(createElement).toHaveBeenCalledWith('a')
    expect(anchor.href).toBe('https://mail.google.com/mail/?view=cm&fs=1&to=a@b.com')
    expect(anchor.target).toBe('_blank')
    expect(click).toHaveBeenCalledOnce()
    expect(remove).toHaveBeenCalledOnce()
    expect(appendChild).toHaveBeenCalledWith(anchor)
  })

  it('navigates with mailto in the current tab', () => {
    const href = vi.fn()
    vi.stubGlobal('location', { href: '' })
    Object.defineProperty(window.location, 'href', { set: href, configurable: true })

    expect(openEmailCompose('mailto:a@b.com', 'mailto')).toBe(true)
    expect(href).toHaveBeenCalledWith('mailto:a@b.com')
  })
})
