import { cn } from '@/lib/cn'

type Props = {
  className?: string
  /** Square crop on the heart « m » for collapsed sidebar. */
  compact?: boolean
}

export function MedijobLogo({ className, compact = false }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand asset in /public
    <img
      src="/brand/medijob-logo.png"
      alt="Medijob"
      className={cn(
        compact ? 'size-8 object-cover object-left' : 'h-8 w-auto object-contain',
        className,
      )}
    />
  )
}
