import { describe, expect, it } from 'vitest'
import {
  decideEventStamp,
  POURVU_TARGETS,
  QUALIFIE_TARGETS,
  STAFFED_TARGETS,
} from './activite-event-stamp'

const now = new Date('2026-09-15T12:00:00.000Z')
const earlier = new Date('2026-09-01T12:00:00.000Z')

describe('decideEventStamp', () => {
  it('stamps on transition into target', () => {
    expect(
      decideEventStamp({
        previous: 'NOUVEAU',
        next: 'QUALIFIE',
        targets: QUALIFIE_TARGETS,
        existing: null,
        now,
      }),
    ).toEqual(now)
  })

  it('leaves null on first observation already at target', () => {
    expect(
      decideEventStamp({
        previous: null,
        next: 'STAFFED',
        targets: STAFFED_TARGETS,
        existing: null,
        now,
      }),
    ).toBeNull()
  })

  it('never overwrites an existing stamp', () => {
    expect(
      decideEventStamp({
        previous: 'EN_RECHERCHE',
        next: 'POURVU',
        targets: POURVU_TARGETS,
        existing: earlier,
        now,
      }),
    ).toEqual(earlier)
  })

  it('keeps stamp on rollback away from target', () => {
    expect(
      decideEventStamp({
        previous: 'POURVU',
        next: 'EN_RECHERCHE',
        targets: POURVU_TARGETS,
        existing: earlier,
        now,
      }),
    ).toEqual(earlier)
  })

  it('stamps Badakan CREATED → STAFFED', () => {
    expect(
      decideEventStamp({
        previous: 'CREATED',
        next: 'STAFFED',
        targets: STAFFED_TARGETS,
        existing: null,
        now,
      }),
    ).toEqual(now)
  })
})
