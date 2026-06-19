import { cn } from '@/lib/cn'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}

export function Switch({ checked, onChange, label, disabled }: Props) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-3', disabled && 'opacity-50')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full border transition-colors',
          checked ? 'border-accent bg-accent' : 'border-border bg-surface',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
      <span className="text-sm text-fg">{label}</span>
    </label>
  )
}
