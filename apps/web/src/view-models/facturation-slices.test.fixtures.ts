import { facturationMissions } from '@/server/routers/facturation.test.fixtures'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'

export const wonSliceMission: FacturationMissionRecord = {
  ...facturationMissions[0]!,
  id: 'm-won',
  marge: 800,
  devis: [
    {
      ...facturationMissions[0]!.devis[0]!,
      id: 'd-won',
      missionId: 'm-won',
      status: 'ACCEPTED',
      acceptedAt: new Date('2026-08-12T00:00:00Z'),
      amountHt: 4000,
    },
  ],
}

export const cancelledSliceMission: FacturationMissionRecord = {
  ...wonSliceMission,
  id: 'm-cancel',
  status: 'ANNULEE',
  marge: 500,
  devis: [{ ...wonSliceMission.devis[0]!, id: 'd-cancel', missionId: 'm-cancel' }],
}

export function sliceMission(
  partial: Partial<FacturationMissionRecord> & Pick<FacturationMissionRecord, 'id'>,
): FacturationMissionRecord {
  const devis = partial.devis ?? [
    { ...wonSliceMission.devis[0]!, id: `d-${partial.id}`, missionId: partial.id },
  ]
  return { ...wonSliceMission, ...partial, devis }
}
