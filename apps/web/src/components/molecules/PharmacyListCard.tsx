'use client'

import { motion } from 'framer-motion'
import { Building2, Briefcase, User } from 'lucide-react'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { Badge } from '@/components/atoms/Badge'
import { PharmacyStatusBadge } from '@/components/molecules/PharmacyStatusBadge'
import { ListCardChip } from '@/components/molecules/ListCardChip'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardMeta } from '@/components/molecules/ListCardMeta'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import { cardHover } from '@/lib/motion/variants'

type Props = {
  row: PharmacyListRow
}

const badgeClass = 'px-2 py-0 text-[11px]'

export function PharmacyListCard({ row }: Props) {
  return (
    <motion.div className="h-full" {...cardHover}>
      <ListCardShell>
        <ListCardHeader
          media={
            <span
              className={`grid ${LIST_CARD_MEDIA_CLASS} place-items-center rounded-lg bg-primary-muted text-primary`}
            >
              <Building2 className="size-4" aria-hidden />
            </span>
          }
          title={row.name}
          subtitle={row.city ?? undefined}
          trailing={
            <div className="flex flex-col items-end gap-1">
              <PharmacyStatusBadge status={row.status} />
              <Badge variant="accent" className={badgeClass}>
                <Briefcase className="mr-1 inline size-3" aria-hidden />
                {row.missionCount}
              </Badge>
            </div>
          }
        />
        <ListCardMeta>
          {row.groupementName ? <ListCardChip>{row.groupementName}</ListCardChip> : null}
          {row.primaryContactName ? (
            <ListCardChip icon={User}>{row.primaryContactName}</ListCardChip>
          ) : null}
        </ListCardMeta>
      </ListCardShell>
    </motion.div>
  )
}
