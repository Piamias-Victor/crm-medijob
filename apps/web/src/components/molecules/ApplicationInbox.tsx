import { Inbox } from 'lucide-react'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { EmptyState } from '@/components/atoms/EmptyState'
import type { InboxItem } from '@/view-models/application-inbox'

export function ApplicationInbox({ items }: { items: InboxItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Aucune candidature en attente"
        description="Les candidatures reçues depuis le site apparaîtront ici."
      />
    )
  }

  return (
    <Card className="divide-y divide-border p-0">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-fg">
              {item.firstName} {item.lastName}
            </p>
            <p className="truncate text-xs text-fg-muted">
              {item.email}
              {item.city ? ` · ${item.city}` : ''} — {item.jobOffer.title}
            </p>
          </div>
          {item.jobTitle ? <Badge>{item.jobTitle.name}</Badge> : null}
          <Badge variant="warning">En attente</Badge>
        </div>
      ))}
    </Card>
  )
}
