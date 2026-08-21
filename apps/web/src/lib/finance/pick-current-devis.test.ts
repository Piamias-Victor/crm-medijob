import { describe, expect, it } from 'vitest'
import { pickCurrentDevis } from '@/lib/finance/pick-current-devis'
import type { DevisRecord } from '@/view-models/devis'

function row(partial: Partial<DevisRecord> & Pick<DevisRecord, 'id' | 'status'>): DevisRecord {
  return {
    missionId: 'm1',
    kind: 'CDD',
    hours: null,
    hourlyRate: null,
    amountHt: 3000,
    amountTtc: 3600,
    htSource: 'TYPED',
    sentAt: null,
    acceptedAt: null,
    invoicedAt: null,
    updatedAt: new Date('2026-08-19'),
    ...partial,
  }
}

describe('pickCurrentDevis', () => {
  it('uses the lone DRAFT as current when nothing was sent', () => {
    const draft = row({ id: 'd-draft', status: 'DRAFT' })
    expect(pickCurrentDevis([draft])?.id).toBe('d-draft')
  })

  it('keeps SENT over a later DRAFT', () => {
    const sent = row({
      id: 'd-sent',
      status: 'SENT',
      sentAt: new Date('2026-08-10T00:00:00Z'),
    })
    const draft = row({
      id: 'd-draft',
      status: 'DRAFT',
      updatedAt: new Date('2026-08-20'),
    })
    expect(pickCurrentDevis([sent, draft])?.id).toBe('d-sent')
  })
})
