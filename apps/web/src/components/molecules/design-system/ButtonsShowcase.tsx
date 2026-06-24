import { Button } from '@/components/atoms/Button'

export function ButtonsShowcase() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="accent">Primaire teal</Button>
        <Button variant="primary">Secondaire navy</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="danger">Destructif</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="accent" disabled>
          Désactivé
        </Button>
      </div>
    </div>
  )
}
