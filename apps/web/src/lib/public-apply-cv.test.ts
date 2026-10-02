import { describe, expect, it } from 'vitest'
import {
  publicApplyCvError,
  sanitizePublicApplyFilename,
} from '@/lib/public-apply-cv'

describe('publicApplyCvError', () => {
  it('accepts PDF magic', () => {
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])
    expect(publicApplyCvError({ filename: 'cv.pdf', size: bytes.length, bytes })).toBeNull()
  })

  it('rejects spoofed PDF extension', () => {
    const bytes = new Uint8Array([0x00, 0x01, 0x02, 0x03])
    expect(publicApplyCvError({ filename: 'cv.pdf', size: 4, bytes })).toMatch(/type/)
  })

  it('rejects oversize', () => {
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46])
    expect(
      publicApplyCvError({ filename: 'cv.pdf', size: 6 * 1024 * 1024, bytes }),
    ).toMatch(/5 Mo/)
  })

  it('sanitizes filename', () => {
    expect(sanitizePublicApplyFilename('../../evil cv!.pdf')).toBe('evil-cv-.pdf')
  })
})
