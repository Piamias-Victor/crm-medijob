import { EMPTY_PILOTAGE_CHARTS } from '@/view-models/facturation-pilotage-charts'
import { EMPTY_PILOTAGE_CONVERSION } from '@/view-models/facturation-pilotage-conversion'
import { EMPTY_PILOTAGE_GAUGE } from '@/view-models/facturation-pilotage-gauge'
import { EMPTY_PILOTAGE_GOGO } from '@/view-models/facturation-pilotage-gogo'
import { EMPTY_PILOTAGE_MATRIX } from '@/view-models/facturation-pilotage-matrix'
import { EMPTY_PILOTAGE_MONTHLY } from '@/view-models/facturation-pilotage-monthly'
import { EMPTY_PILOTAGE_POLES } from '@/view-models/facturation-pilotage-poles'
import type { Pilotage } from '@/view-models/facturation-pilotage'

export const EMPTY_PILOTAGE: Pilotage = {
  kpis: {
    ca: 0,
    caPlacement: 0,
    caInterim: 0,
    marge: 0,
    margePct: 0,
    placementsActifs: 0,
    pharmaciesActives: 0,
  },
  cancelled: { count: 0, ca: 0, marge: 0 },
  months: [],
  gauge: EMPTY_PILOTAGE_GAUGE,
  poles: EMPTY_PILOTAGE_POLES,
  charts: EMPTY_PILOTAGE_CHARTS,
  conversion: EMPTY_PILOTAGE_CONVERSION,
  goNoGo: EMPTY_PILOTAGE_GOGO,
  monthly: EMPTY_PILOTAGE_MONTHLY,
  matrix: EMPTY_PILOTAGE_MATRIX,
}
