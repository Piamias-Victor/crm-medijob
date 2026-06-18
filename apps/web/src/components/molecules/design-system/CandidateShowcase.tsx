import { MapPin, GraduationCap, Monitor } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'
import { Card } from '@/components/atoms/Card'

export function CandidateShowcase() {
  return (
    <Card className="w-80">
      <div className="flex items-center gap-3">
        <Avatar name="Léa Martin" className="size-11" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">Léa Martin</p>
          <p className="flex items-center gap-1 text-xs text-fg-muted">
            <MapPin className="size-3" /> Lyon (69)
          </p>
        </div>
        <Badge variant="success" className="ml-auto">
          Disponible
        </Badge>
      </div>
      <div className="mt-3 space-y-1.5 text-xs text-fg-muted">
        <p className="flex items-center gap-1.5">
          <GraduationCap className="size-3.5" /> Pharmacien adjoint
        </p>
        <p className="flex items-center gap-1.5">
          <Monitor className="size-3.5" /> LGPI · Winpharma
        </p>
      </div>
    </Card>
  )
}
