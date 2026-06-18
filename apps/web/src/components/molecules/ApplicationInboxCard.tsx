'use client'

import { motion } from 'framer-motion'
import { Briefcase, Mail, MapPin } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { ListCardChip } from '@/components/molecules/ListCardChip'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardMeta } from '@/components/molecules/ListCardMeta'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import { cardHover } from '@/lib/motion/variants'
import { formatInboxDate, type InboxItem } from '@/view-models/application-inbox'

const badgeClass = 'px-2 py-0 text-[11px]'

export function ApplicationInboxCard({ item }: { item: InboxItem }) {
  const name = `${item.firstName} ${item.lastName}`.trim()

  return (
    <motion.div className="h-full" {...cardHover}>
      <ListCardShell>
        <ListCardHeader
          media={<Avatar name={name} className={`${LIST_CARD_MEDIA_CLASS} rounded-lg`} />}
          title={name}
          subtitle={formatInboxDate(item.createdAt)}
          trailing={<Badge variant="warning" className={badgeClass}>En attente</Badge>}
        />
        <ListCardMeta>
          <ListCardChip icon={Briefcase}>{item.jobOffer.title}</ListCardChip>
          <ListCardChip icon={Mail}>{item.email}</ListCardChip>
          {item.city ? <ListCardChip icon={MapPin}>{item.city}</ListCardChip> : null}
        </ListCardMeta>
      </ListCardShell>
    </motion.div>
  )
}
