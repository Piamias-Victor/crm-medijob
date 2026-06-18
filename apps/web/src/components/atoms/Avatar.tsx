import { cn } from '@/lib/cn'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-label={name}
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-full bg-primary-muted text-sm font-semibold text-primary',
        className,
      )}
    >
      {initials(name) || '?'}
    </span>
  )
}
