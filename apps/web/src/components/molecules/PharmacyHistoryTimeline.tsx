'use client'

import { History } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { ActivityTimelineItem } from '@/components/molecules/ActivityTimelineItem'
import { PharmacyHistoryMissionItem } from '@/components/molecules/PharmacyHistoryMissionItem'
import type { PharmacyHistoryItem } from '@/view-models/pharmacy-history.types'

type Props = {
  items: PharmacyHistoryItem[]
  isFiltered: boolean
}

export function PharmacyHistoryTimeline({ items, isFiltered }: Props) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={History}
        title={isFiltered ? 'Aucune activité pour ce filtre' : 'Aucune activité enregistrée'}
        description={
          isFiltered
            ? 'Essayez un autre type ou ajoutez une entrée manuelle.'
            : 'Ajoutez une note ou un appel pour démarrer l’historique.'
        }
      />
    )
  }

  return (
    <div className="space-y-0">
      {items.map((item) =>
        item.kind === 'mission' ? (
          <PharmacyHistoryMissionItem key={`mission-${item.id}`} entry={item} />
        ) : (
          <ActivityTimelineItem key={`log-${item.id}`} entry={item} />
        ),
      )}
    </div>
  )
}
