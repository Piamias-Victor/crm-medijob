import { cn } from '@/lib/cn'

export function adminNavLinkClass(active: boolean): string {
  return cn(
    'rounded-full border px-4 py-2 text-sm font-medium transition-all',
    active
      ? 'border-accent bg-accent text-accent-fg shadow-md shadow-accent/30'
      : 'border-border bg-white text-fg shadow-sm hover:border-accent/50 hover:bg-accent-muted/70',
  )
}
