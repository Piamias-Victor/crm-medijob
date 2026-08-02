// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl } from '@/lib/phone/build-whatsapp-url'

describe('buildWhatsAppUrl', () => {
  it('builds wa.me deep link', () => {
    expect(buildWhatsAppUrl('06 12 34 56 78')).toBe('https://wa.me/33612345678')
  })

  it('returns null when phone invalid', () => {
    expect(buildWhatsAppUrl(null)).toBeNull()
  })
})
