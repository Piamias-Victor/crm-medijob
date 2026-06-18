'use client'

import { motion } from 'framer-motion'
import { Building2, Mail, Phone } from 'lucide-react'
import type { ContactListRow } from '@/view-models/contact-list'
import { ROLE_LABELS } from '@/lib/contact-options'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { Avatar } from '@/components/atoms/Avatar'
import { ListCardChip } from '@/components/molecules/ListCardChip'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardMeta } from '@/components/molecules/ListCardMeta'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import { cardHover } from '@/lib/motion/variants'

type Props = {
  row: ContactListRow
}

export function ContactListCard({ row }: Props) {
  return (
    <motion.div className="h-full" {...cardHover}>
      <ListCardShell href={`/contacts/${row.id}`}>
        <ListCardHeader
          media={<Avatar name={row.fullName} className={`${LIST_CARD_MEDIA_CLASS} rounded-lg`} />}
          title={row.fullName}
          subtitle={ROLE_LABELS[row.role]}
        />
        <ListCardMeta>
          <ListCardChip icon={Building2}>{row.pharmacyName}</ListCardChip>
          {row.phone ? <ListCardChip icon={Phone}>{row.phone}</ListCardChip> : null}
          {row.email ? <ListCardChip icon={Mail}>{row.email}</ListCardChip> : null}
        </ListCardMeta>
      </ListCardShell>
    </motion.div>
  )
}
