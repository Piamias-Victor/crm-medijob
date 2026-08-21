import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'

export type DetailField = { label: string; value: string | null | undefined }

export function DetailFieldList({ fields }: { fields: DetailField[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.label} className="min-w-0">
          <dt className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
            {field.label}
          </dt>
          <dd className="mt-1 break-words text-sm text-fg">{field.value?.trim() || TABLE_EMPTY_CELL}</dd>
        </div>
      ))}
    </dl>
  )
}
