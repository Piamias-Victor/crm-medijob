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
  fillClassName?: string
}

const THUMB =
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-accent'

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  onChange,
  onCommit,
  className,
  fillClassName = 'bg-accent',
}: Props) {
  const span = max - min
  const percent = span <= 0 ? 0 : ((value - min) / span) * 100
  return (
    <div className={cn('relative flex h-4 items-center', className)}>
      <div className="pointer-events-none absolute inset-x-0 h-2 overflow-hidden rounded-full bg-white/60">
        <div className={cn('h-full rounded-full', fillClassName)} style={{ width: `${percent}%` }} />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        onMouseUp={onCommit}
        onTouchEnd={onCommit}
        onKeyUp={onCommit}
        className={cn(
          'relative z-10 h-4 w-full cursor-pointer appearance-none bg-transparent',
          THUMB,
        )}
      />
    </div>
  )
}
