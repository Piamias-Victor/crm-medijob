import { Inbox } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { EmptyState } from '@/components/atoms/EmptyState'

export function EmptyStateShowcase() {
  return (
    <EmptyState
      icon={Inbox}
      title="Aucun candidat pour le moment"
      description="Importez un CV ou créez un candidat pour démarrer votre CVthèque."
      action={<Button variant="accent">Importer un CV</Button>}
    />
  )
}
