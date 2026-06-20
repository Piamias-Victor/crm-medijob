// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { runCvExtraction } from '@/server/ai/cv-extraction'
import type { CvExtractionProvider } from '@/server/ai/cv-extraction-provider'

describe('runCvExtraction', () => {
  it('forwards the uploaded file to the provider before parsing JSON', async () => {
    const provider: CvExtractionProvider = {
      extract: vi.fn().mockResolvedValue(
        JSON.stringify({ firstName: 'Alice', lastName: 'Martin', jobTitle: 'Pharmacien' }),
      ),
    }

    const file = {
      filename: 'cv.png',
      mimeType: 'image/png',
      dataBase64: 'png-data',
    }
    const result = await runCvExtraction(provider, file)

    expect(provider.extract).toHaveBeenCalledWith(file)
    expect(result.firstName).toBe('Alice')
  })

  it('normalizes messy AI output instead of failing schema validation', async () => {
    const provider: CvExtractionProvider = {
      extract: vi.fn().mockResolvedValue(
        JSON.stringify({
          firstName: 'Jean',
          email: 'invalid',
          availableFrom: '2026-08-15',
        }),
      ),
    }

    const result = await runCvExtraction(provider, {
      filename: 'cv.pdf',
      mimeType: 'application/pdf',
      dataBase64: 'pdf-data',
    })

    expect(result.email).toBeUndefined()
    expect(result.availableFrom).toBe('2026-08-15T00:00:00.000Z')
  })

  it('enriches contact fields from rawText and strips rawText from the response', async () => {
    const provider: CvExtractionProvider = {
      extract: vi.fn().mockResolvedValue(
        JSON.stringify({
          firstName: 'Jean',
          lastName: 'Dupont',
          rawText: 'Contact jean.dupont@mail.fr · 06 12 34 56 78 · 83200 Toulon',
        }),
      ),
    }

    const result = await runCvExtraction(provider, {
      filename: 'cv.pdf',
      mimeType: 'application/pdf',
      dataBase64: 'pdf-data',
    })

    expect(result.email).toBe('jean.dupont@mail.fr')
    expect(result.postalCode).toBe('83200')
    expect(result).not.toHaveProperty('rawText')
  })
})
