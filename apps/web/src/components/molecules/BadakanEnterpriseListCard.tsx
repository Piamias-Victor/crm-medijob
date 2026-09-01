'use client'

import { Building2 } from 'lucide-react'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { ListCardChip } from '@/components/molecules/ListCardChip'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardMeta } from '@/components/molecules/ListCardMeta'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import type { BadakanEnterpriseListItem } from '@/view-models/badakan-enterprise-list'

export function BadakanEnterpriseListCard({ row }: { row: BadakanEnterpriseListItem }) {
  return (
    <ListCardShell href={row.href}>
      <ListCardHeader
        media={
          <span
            className={`grid ${LIST_CARD_MEDIA_CLASS} place-items-center rounded-lg bg-primary-muted text-primary`}
          >
            <Building2 className="size-4" aria-hidden />
          </span>
        }
        title={row.name}
        subtitle={row.siretLabel}
      />
      <ListCardMeta>
        <ListCardChip icon={Building2}>{row.cityLabel}</ListCardChip>
      </ListCardMeta>
    </ListCardShell>
  )
}
