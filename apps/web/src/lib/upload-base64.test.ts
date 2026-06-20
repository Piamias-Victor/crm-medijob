// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  MAX_UPLOAD_BYTES,
  maxBase64LengthForSize,
  validateDecodedBase64Size,
} from '@/lib/upload-base64'

describe('validateDecodedBase64Size', () => {
  it('rejette si taille décodée dépasse size déclaré', () => {
    const huge = Buffer.alloc(11 * 1024 * 1024).toString('base64')
    expect(validateDecodedBase64Size(huge, 10 * 1024 * 1024)).toMatchObject({ ok: false })
  })

  it('accepte si taille décodée <= size', () => {
    const data = Buffer.alloc(1024).toString('base64')
    expect(validateDecodedBase64Size(data, 1024)).toMatchObject({ ok: true })
  })

  it('rejette base64 trop long avant décodage', () => {
    const maxLen = maxBase64LengthForSize(100)
    const tooLong = 'A'.repeat(maxLen + 1)
    expect(validateDecodedBase64Size(tooLong, 100)).toMatchObject({ ok: false })
  })

  it('expose MAX_UPLOAD_BYTES à 10 Mo', () => {
    expect(MAX_UPLOAD_BYTES).toBe(10 * 1024 * 1024)
  })
})
