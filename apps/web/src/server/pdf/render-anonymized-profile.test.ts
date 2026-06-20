// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { renderAnonymizedProfilePdf } from './render-anonymized-profile'

describe('renderAnonymizedProfilePdf', () => {
  it('renders a non-empty PDF buffer from anonymized markdown', async () => {
    const buffer = await renderAnonymizedProfilePdf(
      '## Profil\n\nProfessionnel expérimenté en officine.',
    )
    expect(buffer.length).toBeGreaterThan(100)
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })
})
