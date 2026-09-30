'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { ActiviteMultiLineChart } from '@/components/molecules/ActiviteMultiLineChart'
import type { ActiviteSeriesPoint } from '@/view-models/activite-overview'

const ENTRANTS = [
  { dataKey: 'candidatesCrm', name: 'Candidats CRM', stroke: '#0f766e' },
  { dataKey: 'candidatesApp', name: 'Candidats App', stroke: '#0369a1' },
  { dataKey: 'appValidated', name: 'App-validated', stroke: '#4d7c0f' },
  { dataKey: 'qualifies', name: 'Qualifiés', stroke: '#b45309' },
  { dataKey: 'applications', name: 'Applications', stroke: '#7c3aed' },
]

const MISSIONS = [
  { dataKey: 'missionsCreated', name: 'CRM créées', stroke: '#0f766e' },
  { dataKey: 'missionsFilled', name: 'CRM pourvues', stroke: '#0369a1' },
  { dataKey: 'badakanCreated', name: 'Badakan créées', stroke: '#b45309' },
  { dataKey: 'badakanStaffed', name: 'Badakan staffées', stroke: '#7c3aed' },
]

type Props = { entrants: ActiviteSeriesPoint[]; missions: ActiviteSeriesPoint[] }

export function ActiviteCharts({ entrants, missions }: Props) {
  return (
    <>
      <SectionCard variant="glass" title="Entrants" description="Candidats, validations, applications." bodyClassName="p-4 sm:p-5">
        <ActiviteMultiLineChart data={entrants} series={ENTRANTS} />
      </SectionCard>
      <SectionCard variant="glass" title="Missions" description="CRM et Badakan séparés." bodyClassName="p-4 sm:p-5">
        <ActiviteMultiLineChart data={missions} series={MISSIONS} />
      </SectionCard>
    </>
  )
}
