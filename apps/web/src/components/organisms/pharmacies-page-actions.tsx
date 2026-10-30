import Link from 'next/link'
import { Plus, Upload } from 'lucide-react'
import { accentButtonClassName } from '@/lib/button-styles'

export function PharmaciesPageActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/pharmacies/import"
        className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface"
      >
        <Upload className="size-4" />
        Importer CSV
      </Link>
      <Link href="/pharmacies/new" className={accentButtonClassName}>
        <Plus className="size-4" />
        Nouvelle pharmacie
      </Link>
    </div>
  )
}
