'use client'

type Population = 'default' | 'archive'

type Props = {
  value: Population
  onChange: (value: Population) => void
}

export function AppIntakePopulationToggle({ value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
      <input
        type="checkbox"
        checked={value === 'archive'}
        onChange={(e) => onChange(e.target.checked ? 'archive' : 'default')}
        className="size-4"
      />
      Archives / refusés
    </label>
  )
}
