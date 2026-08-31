'use client'

import { Calendar, CalendarClock } from 'lucide-react'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { ListCardChip } from '@/components/molecules/ListCardChip'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardMeta } from '@/components/molecules/ListCardMeta'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import type { BadakanMissionListItem } from '@/view-models/badakan-mission-list'

export function BadakanMissionListCard({ row }: { row: BadakanMissionListItem }) {
  return (
    <ListCardShell href={row.href}>
      <ListCardHeader
        media={
          <span
            className={`grid ${LIST_CARD_MEDIA_CLASS} place-items-center rounded-lg bg-primary-muted text-primary`}
          >
            <CalendarClock className="size-4" aria-hidden />
          </span>
        }
        title={row.pharmacyName}
        subtitle={row.stepLabel}
      />
      <ListCardMeta>
        <ListCardChip icon={Calendar}>{row.periodLabel}</ListCardChip>
      </ListCardMeta>
    </ListCardShell>
  )
}
