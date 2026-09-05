'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { DetailFieldList } from '@/components/molecules/DetailFieldList'
import { BadakanSearchAppliedRow } from '@/components/molecules/BadakanSearchAppliedRow'
import { BadakanMissionMatchingTab } from '@/components/organisms/BadakanMissionMatchingTab'
import { BadakanMissionProposalsSection } from '@/components/organisms/BadakanMissionProposalsSection'
import type { BadakanMissionDetail } from '@/view-models/badakan-mission-detail'

export function BadakanMissionDetailPage({ detail }: { detail: BadakanMissionDetail }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        variant="glass"
        title={detail.pharmacyName}
        description="Mission Badakan — hors kanban Missions CRM."
      >
        <DetailFieldList fields={detail.fields} />
      </SectionCard>
      <SectionCard variant="glass" title="Matching IA">
        <BadakanMissionMatchingTab
          missionId={detail.id}
          jobTitleName={detail.matching.jobTitleName}
          pharmacyName={detail.matching.pharmacyName}
          canMatch={detail.matching.canMatch}
        />
      </SectionCard>
      <SectionCard variant="glass" title="Candidats proposés">
        <BadakanMissionProposalsSection missionId={detail.id} />
      </SectionCard>
      <SectionCard variant="glass" title={detail.sectionTitle}>
        {detail.searchApplied.length === 0 ? (
          <p className="text-sm text-fg-muted">Aucun candidat n’a postulé sur cette mission.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {detail.searchApplied.map((row) => (
              <BadakanSearchAppliedRow key={row.recipientId} row={row} />
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  )
}
