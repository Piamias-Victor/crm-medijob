'use client'

import { History } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { ActivityTimelineItem } from '@/components/molecules/ActivityTimelineItem'
import type { ActivityLogRow } from '@/view-models/activity-log'

type Props = {
  items: ActivityLogRow[]
  isFiltered: boolean
}

export function ActivityTimeline({ items, isFiltered }: Props) {
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
      {items.map((entry) => (
        <ActivityTimelineItem key={entry.id} entry={entry} />
      ))}
    </div>
  )
}
