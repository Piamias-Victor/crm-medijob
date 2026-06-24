import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'accent' | 'ghost' | 'outline' | 'danger'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
  accent: 'bg-accent text-accent-fg hover:bg-accent-hover',
  ghost: 'bg-transparent text-fg hover:bg-surface',
  outline: 'border border-border bg-transparent text-fg hover:bg-surface',
  danger: 'bg-error text-accent-fg hover:opacity-90',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }

export function Button({ variant = 'primary', className, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
