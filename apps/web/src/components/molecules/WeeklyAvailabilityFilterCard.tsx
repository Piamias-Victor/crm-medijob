import { MapPin, Phone, MessageSquare } from 'lucide-react'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { ListCardChip } from '@/components/molecules/ListCardChip'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardMeta } from '@/components/molecules/ListCardMeta'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import type { AvailabilityFilterRow } from '@/view-models/weekly-availability-filter-row'

export function WeeklyAvailabilityFilterCard({ row }: { row: AvailabilityFilterRow }) {
  return (
    <ListCardShell>
      <ListCardHeader
        media={
          <span
            className={`grid ${LIST_CARD_MEDIA_CLASS} place-items-center rounded-lg bg-primary-muted text-primary`}
          >
            <Phone className="size-4" aria-hidden />
          </span>
        }
        title={row.fullName}
        subtitle={row.jobTitleName}
      />
      <ListCardMeta>
        {row.city ? <ListCardChip icon={MapPin}>{row.city}</ListCardChip> : null}
        {row.telHref && row.phone ? (
          <a href={row.telHref} className="text-sm font-medium text-accent hover:text-accent-hover">
            {row.phone}
          </a>
        ) : null}
        {row.smsHref ? (
          <a
            href={row.smsHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover"
          >
            <MessageSquare className="size-3.5" aria-hidden />
            SMS
          </a>
        ) : null}
      </ListCardMeta>
    </ListCardShell>
  )
}
