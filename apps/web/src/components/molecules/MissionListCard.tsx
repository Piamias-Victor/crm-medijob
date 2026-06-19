'use client'

import { motion } from 'framer-motion'
import { Building2, Briefcase, Calendar, MapPin, UserRound } from 'lucide-react'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { ListCardChip } from '@/components/molecules/ListCardChip'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardMeta } from '@/components/molecules/ListCardMeta'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'
import { cardHover } from '@/lib/motion/variants'
import type { MissionListItem } from '@/view-models/mission-kanban.types'

const badgeClass = 'px-2 py-0 text-[11px]'

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('fr-FR').format(value)
}

export function MissionListCard({ row }: { row: MissionListItem }) {
  const subtitle = [row.jobTitle, row.city].filter(Boolean).join(' · ')

  return (
    <motion.div className="h-full" {...cardHover}>
      <ListCardShell href={`/missions/${row.id}`}>
        <ListCardHeader
          media={
            <span
              className={`grid ${LIST_CARD_MEDIA_CLASS} place-items-center rounded-lg bg-primary-muted text-primary`}
            >
              <Briefcase className="size-4" aria-hidden />
            </span>
          }
          title={row.title}
          subtitle={subtitle || undefined}
          trailing={<MissionStatusBadge status={row.status} className={badgeClass} />}
        />
        <ListCardMeta>
          <ListCardChip icon={Building2}>{row.pharmacyName}</ListCardChip>
          {row.city ? <ListCardChip icon={MapPin}>{row.city}</ListCardChip> : null}
          {row.referent ? <ListCardChip icon={UserRound}>{row.referent}</ListCardChip> : null}
          <ListCardChip icon={Calendar}>{formatDate(row.startDate)}</ListCardChip>
        </ListCardMeta>
      </ListCardShell>
    </motion.div>
  )
}
