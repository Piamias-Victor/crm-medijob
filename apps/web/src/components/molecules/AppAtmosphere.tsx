import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  className?: string
  children?: ReactNode
}

export function AppAtmosphere({ className, children }: Props) {
  return (
    <div className={cn('relative flex flex-1 flex-col', className)}>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-surface)_0%,#ffffff_72%)]" />
        <div className="medijob-orb absolute -left-40 top-[-15%] size-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="medijob-orb medijob-orb--delayed absolute -right-32 bottom-[-10%] size-72 rounded-full bg-accent/4 blur-3xl" />
        <div className="medijob-grid medijob-grid--fade absolute inset-0 opacity-[0.18]" />
        <div className="medijob-grain absolute inset-0 opacity-[0.012]" />
      </div>
      {children}
    </div>
  )
}
