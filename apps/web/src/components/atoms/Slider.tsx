import { cn } from '@/lib/cn'

type Props = {
  value: number
  min?: number
  max?: number
  step?: number
  label: string
  onChange: (value: number) => void
  onCommit?: () => void
  className?: string
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  onChange,
  onCommit,
  className,
}: Props) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={label}
      onChange={(e) => onChange(Number(e.target.value))}
      onMouseUp={onCommit}
      onTouchEnd={onCommit}
      onKeyUp={onCommit}
      className={cn(
        'h-2 w-full cursor-pointer appearance-none rounded-full bg-surface accent-accent',
        className,
      )}
    />
  )
}
