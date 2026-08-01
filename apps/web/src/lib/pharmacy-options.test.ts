import { describe, it, expect } from 'vitest'
import { STATUS_LABELS } from '@/lib/pharmacy-options'

describe('STATUS_LABELS', () => {
  it('labels ACTIF as Client (CSV V1-016)', () => {
    expect(STATUS_LABELS).toEqual({
      PROSPECT: 'Prospect',
      ACTIF: 'Client',
      INACTIF: 'Inactif',
    })
  })
})
