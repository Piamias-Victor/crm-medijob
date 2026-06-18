'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { ListCardChip } from '@/components/molecules/ListCardChip'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardMeta } from '@/components/molecules/ListCardMeta'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import { cardHover } from '@/lib/motion/variants'
import type { CandidateListItem } from '@/view-models/candidate-kanban'

const badgeClass = 'px-2 py-0 text-[11px]'

export function CvthequeListCard({ candidate }: { candidate: CandidateListItem }) {
  const subtitle = [candidate.jobTitle, candidate.city].filter(Boolean).join(' · ')

  return (
    <motion.div className="h-full" {...cardHover}>
      <ListCardShell href={`/candidats/${candidate.id}`}>
        <ListCardHeader
          media={<Avatar name={candidate.name} className={`${LIST_CARD_MEDIA_CLASS} rounded-lg`} />}
          title={candidate.name}
          subtitle={subtitle || undefined}
          trailing={
            <Badge variant="accent" className={badgeClass}>
              {candidate.activeMissionCount} mission(s)
            </Badge>
          }
        />
        <ListCardMeta>
          {candidate.referent ? <ListCardChip icon={User}>{candidate.referent}</ListCardChip> : null}
        </ListCardMeta>
      </ListCardShell>
    </motion.div>
  )
}
