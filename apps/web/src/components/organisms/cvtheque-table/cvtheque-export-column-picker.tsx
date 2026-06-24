import { cvthequeExportColumnGroups, cvthequeExportColumnHeaders } from '@/view-models/cvtheque-export-columns'
import type { CvthequeExportColumnId } from '@/view-models/cvtheque-export-column-ids'

type Props = {
  selected: CvthequeExportColumnId[]
  onToggle: (id: CvthequeExportColumnId) => void
}

export function CvthequeExportColumnPicker({ selected, onToggle }: Props) {
  return (
    <>
      {cvthequeExportColumnGroups.map((group) => (
        <fieldset key={group.label} className="space-y-2">
          <legend className="text-sm font-medium text-fg">{group.label}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {group.columnIds.map((id) => (
              <label key={id} className="flex items-center gap-2 text-sm text-fg-muted">
                <input
                  type="checkbox"
                  checked={selected.includes(id)}
                  onChange={() => onToggle(id)}
                  className="size-4 rounded border-border accent-accent"
                />
                {cvthequeExportColumnHeaders[id]}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </>
  )
}
