import { cn } from '@/lib/cn'
import { BRAND_LOGO_SRC, BRAND_MARK_SRC } from '@/lib/brand-assets'

type Props = {
  className?: string
  /** Heart-m mark for collapsed sidebar. */
  compact?: boolean
  /** Hide from a11y tree when a sibling logo is the visible one. */
  decorative?: boolean
}

export function MedijobLogo({ className, compact = false, decorative = false }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand asset
    <img
      src={compact ? BRAND_MARK_SRC : BRAND_LOGO_SRC}
      alt={decorative ? '' : 'Medijob'}
      aria-hidden={decorative || undefined}
      draggable={false}
      className={cn(
        'object-contain select-none',
        compact ? 'size-8' : 'h-8 w-auto',
        className,
      )}
    />
  )
}
