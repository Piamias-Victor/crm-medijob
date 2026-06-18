import Link from 'next/link'
import { Users } from 'lucide-react'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Avatar } from '@/components/atoms/Avatar'
import { EmptyState } from '@/components/atoms/EmptyState'
import { toListItems, type RawCandidate } from '@/view-models/candidate-kanban'

export function CvthequeList({ candidates }: { candidates: RawCandidate[] }) {
  const items = toListItems(candidates)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Aucun candidat"
        description="Les candidats ajoutés à la CVthèque apparaîtront ici."
      />
    )
  }

  return (
    <Card className="overflow-hidden p-0">
      {items.map((candidate) => (
        <Link
          key={candidate.id}
          href={`/candidats/${candidate.id}`}
          className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-accent-muted/50"
        >
          <Avatar name={candidate.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-fg">{candidate.name}</p>
            <p className="truncate text-xs text-fg-muted">
              {[candidate.jobTitle, candidate.city].filter(Boolean).join(' · ') || '—'}
            </p>
          </div>
          <span className="hidden text-xs text-fg-muted sm:block">
            {candidate.referent ?? '—'}
          </span>
          <Badge variant="accent">{candidate.activeMissionCount} mission(s)</Badge>
        </Link>
      ))}
    </Card>
  )
}
