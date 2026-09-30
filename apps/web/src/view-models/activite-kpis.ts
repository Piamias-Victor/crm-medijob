import {
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Smartphone,
  UserPlus,
  Users,
} from 'lucide-react'
import { ACTIVITE_STAMP_TRACKING_SINCE } from '@/lib/constants/activite'
import type { HomeKpiDef } from '@/view-models/home-kpi'
import type { ActiviteCounts } from '@/view-models/activite-overview'

const stampCaption = `Suivi depuis le ${ACTIVITE_STAMP_TRACKING_SINCE}`

export function buildActiviteKpis(counts: ActiviteCounts): HomeKpiDef[] {
  return [
    { href: '', label: 'Candidats CRM', caption: 'Créés', value: counts.candidatesCrm, icon: UserPlus },
    { href: '', label: 'Candidats App', caption: 'Créés', value: counts.candidatesApp, icon: Smartphone },
    { href: '', label: 'App-validated', caption: stampCaption, value: counts.appValidated, icon: CheckCircle2 },
    { href: '', label: 'Qualifiés', caption: stampCaption, value: counts.qualifies, icon: Users },
    { href: '', label: 'Applications', caption: 'Reçues', value: counts.applications, icon: ClipboardList },
    { href: '', label: 'Missions CRM', caption: 'Créées', value: counts.missionsCreated, icon: Briefcase },
    { href: '', label: 'Missions pourvues', caption: stampCaption, value: counts.missionsFilled, icon: Briefcase, accent: true },
    { href: '', label: 'Badakan créées', caption: '1ʳᵉ synchro', value: counts.badakanCreated, icon: Briefcase },
    { href: '', label: 'Badakan staffées', caption: stampCaption, value: counts.badakanStaffed, icon: Briefcase },
  ]
}
