import type { DevisRecord } from '@/view-models/devis'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'

function devis(partial: Partial<DevisRecord> & Pick<DevisRecord, 'id' | 'missionId' | 'status'>): DevisRecord {
  return {
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

function mission(
  partial: Partial<FacturationMissionRecord> & Pick<FacturationMissionRecord, 'id'>,
): FacturationMissionRecord {
  return {
    pharmacyId: 'p1',
    pharmacyName: 'Pharmacie du Centre',
    referentId: 'u-alice',
    referentName: 'Alice',
    contractType: 'CDD',
    status: 'EN_RECHERCHE',
    marge: null,
    devis: [],
    ...partial,
  }
}

export const olderSent = devis({
  id: 'd-old',
  missionId: 'm-two',
  status: 'SENT',
  sentAt: new Date('2026-07-01T00:00:00Z'),
  amountHt: 1000,
})

export const currentSent = devis({
  id: 'd-new',
  missionId: 'm-two',
  status: 'SENT',
  sentAt: new Date('2026-08-10T00:00:00Z'),
  amountHt: 4000,
})

export const draftOnly = devis({ id: 'd-draft', missionId: 'm-draft', status: 'DRAFT' })

export const facturationMissions: FacturationMissionRecord[] = [
  mission({
    id: 'm-sent',
    pharmacyId: 'p-nord',
    pharmacyName: 'Pharma Nord',
    devis: [
      devis({
        id: 'd-sent',
        missionId: 'm-sent',
        status: 'SENT',
        sentAt: new Date('2026-08-05T00:00:00Z'),
      }),
    ],
  }),
  mission({
    id: 'm-draft',
    pharmacyId: 'p-sud',
    pharmacyName: 'Pharma Sud',
    devis: [draftOnly],
  }),
  mission({
    id: 'm-two',
    pharmacyId: 'p-est',
    pharmacyName: 'Pharma Est',
    devis: [olderSent, currentSent],
  }),
  mission({
    id: 'm-none',
    pharmacyId: 'p-ouest',
    pharmacyName: 'Pharma Ouest',
    referentId: null,
    referentName: null,
    contractType: 'INTERIM',
  }),
]
