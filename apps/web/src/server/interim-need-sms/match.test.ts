import { describe, expect, it } from 'vitest'
import { hasMatchingNewNeed } from './match'
import { needSmsCandidate, needSmsNeed, noGeoLookup, PARIS } from './match.fixtures'

describe('hasMatchingNewNeed', () => {
  it('matches a need with the same JobTitle within 80 km created after last SMS', async () => {
    expect(await hasMatchingNewNeed(needSmsCandidate(), [needSmsNeed()], noGeoLookup)).toBe(
      true,
    )
  })

  it('ignores a need created before the last SMS', async () => {
    expect(
      await hasMatchingNewNeed(
        needSmsCandidate(),
        [needSmsNeed({ createdAt: new Date('2026-08-31T10:00:00.000Z') })],
        noGeoLookup,
      ),
    ).toBe(false)
  })

  it('ignores a Candidate who has never been stamped', async () => {
    expect(
      await hasMatchingNewNeed(
        needSmsCandidate({ lastSentAt: null }),
        [needSmsNeed()],
        noGeoLookup,
      ),
    ).toBe(false)
  })

  it('ignores a need farther than 80 km', async () => {
    expect(
      await hasMatchingNewNeed(
        needSmsCandidate(),
        [needSmsNeed({ latitude: 45.75, longitude: 4.85 })],
        noGeoLookup,
      ),
    ).toBe(false)
  })

  it('ignores a need with a different JobTitle', async () => {
    expect(
      await hasMatchingNewNeed(
        needSmsCandidate(),
        [needSmsNeed({ jobTitleId: 'jt-pharma' })],
        noGeoLookup,
      ),
    ).toBe(false)
  })

  it('includes a need at exactly 80 km', async () => {
    const kmPerDeg = 111.32
    expect(
      await hasMatchingNewNeed(
        needSmsCandidate(),
        [needSmsNeed({ latitude: PARIS.latitude - 80 / kmPerDeg, longitude: PARIS.longitude })],
        noGeoLookup,
      ),
    ).toBe(true)
  })

  it('matches via postal code lookup when the Candidate has no stored coords', async () => {
    const lookup = async (code: string) =>
      code === '75001' ? { lat: PARIS.latitude, lon: PARIS.longitude } : null
    expect(
      await hasMatchingNewNeed(
        needSmsCandidate({ latitude: null, longitude: null, postalCode: '75001' }),
        [needSmsNeed()],
        lookup,
      ),
    ).toBe(true)
  })

  it('ignores a Candidate whose postal code cannot be geocoded', async () => {
    expect(
      await hasMatchingNewNeed(
        needSmsCandidate({ latitude: null, longitude: null, postalCode: '00000' }),
        [needSmsNeed()],
        noGeoLookup,
      ),
    ).toBe(false)
  })
})
