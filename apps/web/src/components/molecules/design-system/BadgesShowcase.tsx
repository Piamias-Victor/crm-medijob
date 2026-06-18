import { Badge } from '@/components/atoms/Badge'

export function BadgesShowcase() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Brouillon</Badge>
      <Badge variant="accent">Pharmacien</Badge>
      <Badge variant="success">Placé</Badge>
      <Badge variant="warning">En cours</Badge>
      <Badge variant="error">Annulée</Badge>
    </div>
  )
}
