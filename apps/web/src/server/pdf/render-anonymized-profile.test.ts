// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { emptyAnonymizedDossier, serializeAnonymizedDossier } from '@/view-models/anonymized-dossier'
import { renderAnonymizedProfilePdf } from './render-anonymized-profile'

describe('renderAnonymizedProfilePdf', () => {
  it('renders PDF from structured sections and skips empty ones', async () => {
    const raw = serializeAnonymizedDossier({
      ...emptyAnonymizedDossier(),
      accroche: 'Professionnel expérimenté en officine.',
      pointsForts: 'Autonomie',
    })
    const buffer = await renderAnonymizedProfilePdf(raw)
    expect(buffer.length).toBeGreaterThan(100)
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })

  it('throws when content is legacy markdown', async () => {
    await expect(renderAnonymizedProfilePdf('## Profil libre')).rejects.toThrow(
      'ANONYMIZED_DOSSIER_INVALID',
    )
  })
})
