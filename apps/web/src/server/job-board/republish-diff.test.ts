import { describe, expect, it } from 'vitest'
import {
  formatDryRunSummary,
  listingRepublishReasons,
  toRepublishCandidate,
} from '@/server/job-board/republish-diff'
import { SECTIONED_OFFER_HTML } from '@/server/routers/job-offer.test.content'

const next = {
  titre: 'Pharmacien',
  metier: 'Pharmacien',
  description: SECTIONED_OFFER_HTML,
  entreprise: 'MEDIJOB',
  ville: 'Lyon',
  type_contrat: 'CDI',
  temps_travail: 'Temps plein',
  contact_email: 'a@b.c',
  publiee: true,
  mise_en_avant: false,
}

describe('republish-diff', () => {
  it('flags missing section titles on current content', () => {
    const reasons = listingRepublishReasons('old blob', next)
    expect(reasons).toContain('sections:4')
    expect(reasons).toContain('description-will-gain-sections')
  })

  it('returns null candidate when nothing to change', () => {
    expect(
      toRepublishCandidate('o1', 'b1', listingRepublishReasons(SECTIONED_OFFER_HTML, next)),
    ).toBeNull()
  })

  it('summarizes dry-run without nominative fields', () => {
    const summary = formatDryRunSummary([
      { offerId: 'abcdefghij', boardListingId: 'b1', reasons: ['sections:4'] },
    ])
    expect(summary.count).toBe(1)
    expect(summary.sampleIds[0]).toBe('abcdefgh')
    expect(summary.byReason['sections:4']).toBe(1)
  })
})
