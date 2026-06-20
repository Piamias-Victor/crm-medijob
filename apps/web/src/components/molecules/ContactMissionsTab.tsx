'use client'

import { Briefcase } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import type { ContactMissionRow } from '@/view-models/contact-detail.types'
import { EntityLinkedMissionRow } from '@/components/molecules/EntityLinkedMissionRow'

export function ContactMissionsTab({ missions }: { missions: ContactMissionRow[] }) {
  if (missions.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Aucune mission liée"
        description="Les besoins associés à ce contact apparaîtront ici."
      />
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {missions.map((mission) => (
        <li key={mission.id}>
          <EntityLinkedMissionRow
            missionId={mission.id}
            title={mission.title}
            subtitle={mission.pharmacy.name}
          />
        </li>
      ))}
    </ul>
  )
}
