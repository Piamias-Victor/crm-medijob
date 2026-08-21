import { describe, expect, it, vi } from 'vitest'
import { openDevisSendResult } from './open-devis-send-result'

vi.mock('@/lib/mailto/open-email-compose', () => ({
  openEmailCompose: vi.fn(),
}))

describe('openDevisSendResult', () => {
  it('downloads the PDF then opens Gmail compose', async () => {
    const open = vi.fn()
    vi.stubGlobal('open', open)
    const { openEmailCompose } = await import('@/lib/mailto/open-email-compose')
    openDevisSendResult({
      document: { id: 'doc1' },
      composeUrl: 'https://mail.google.com/mail/?view=cm&to=marie%40pharma.fr',
    })
    expect(open).toHaveBeenCalledWith(
      '/api/documents/doc1/download',
      '_blank',
      'noopener,noreferrer',
    )
    expect(openEmailCompose).toHaveBeenCalledWith(
      'https://mail.google.com/mail/?view=cm&to=marie%40pharma.fr',
      'gmail',
    )
    vi.unstubAllGlobals()
  })
})
