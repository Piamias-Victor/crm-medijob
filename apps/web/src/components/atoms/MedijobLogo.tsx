import { cn } from '@/lib/cn'

const LOGO_FULL = '/brand/medijob-logo.png'
const LOGO_MARK = '/brand/medijob-mark.png'

type Props = {
  className?: string
  /** Heart-m mark for collapsed sidebar — avoids wordmark crop jump. */
  compact?: boolean
}

export function MedijobLogo({ className, compact = false }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand asset in /public
    <img
      src={compact ? LOGO_MARK : LOGO_FULL}
      alt="Medijob"
      className={cn(
        'object-contain',
        compact ? 'size-8' : 'h-8 w-auto',
        className,
      )}
    />
  )
}
