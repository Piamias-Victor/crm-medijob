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
import type { MissionListRow } from '@/view-models/mission-list'
import { formatDateFr } from '@/view-models/format-date-fr'

const badgeClass = 'px-2 py-0 text-[11px]'

export function MissionListCard({ row }: { row: MissionListRow }) {
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
          <ListCardChip icon={Calendar}>{formatDateFr(row.startDate)}</ListCardChip>
        </ListCardMeta>
      </ListCardShell>
    </motion.div>
  )
}
