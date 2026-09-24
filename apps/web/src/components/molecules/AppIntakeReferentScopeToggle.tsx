'use client'

type Scope = 'mine' | 'all'

type Props = {
  value: Scope
  onChange: (value: Scope) => void
}

export function AppIntakeReferentScopeToggle({ value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
      <input
        type="checkbox"
        checked={value === 'all'}
        onChange={(e) => onChange(e.target.checked ? 'all' : 'mine')}
        className="size-4"
      />
      Voir tous
    </label>
  )
}
