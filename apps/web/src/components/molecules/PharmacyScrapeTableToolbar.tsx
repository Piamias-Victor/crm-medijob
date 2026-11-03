'use client'

import { PharmacyScrapeCopyEmailsButton } from '@/components/molecules/PharmacyScrapeCopyEmailsButton'

type Props = {
  rows: { email: string }[]
  canAdmin: boolean
  selectedCount: number
  deletePending?: boolean
  onSoftDelete: () => void
}

export function PharmacyScrapeTableToolbar({
  rows,
  canAdmin,
  selectedCount,
  deletePending,
  onSoftDelete,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <PharmacyScrapeCopyEmailsButton rows={rows} />
      {canAdmin && selectedCount > 0 && (
        <button
          type="button"
          disabled={deletePending}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-fg hover:bg-surface"
          onClick={onSoftDelete}
        >
          Supprimer ({selectedCount})
        </button>
      )}
    </div>
  )
}
