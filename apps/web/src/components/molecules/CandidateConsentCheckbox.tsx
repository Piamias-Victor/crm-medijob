'use client'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CandidateConsentCheckbox({ checked, onChange }: Props) {
  return (
    <label className="flex items-start gap-3 text-sm text-fg">
      <input
        type="checkbox"
        className="mt-1 size-4 accent-[var(--color-accent)]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        Consentement au traitement des données personnelles enregistré (optionnel à la création
        manuelle).
      </span>
    </label>
  )
}
