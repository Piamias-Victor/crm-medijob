import { Construction } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'

type Props = { title: string; description: string }

export function PagePlaceholder({ title, description }: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold text-fg">{title}</h1>
      <EmptyState icon={Construction} title="Bientôt disponible" description={description} />
    </div>
  )
}
