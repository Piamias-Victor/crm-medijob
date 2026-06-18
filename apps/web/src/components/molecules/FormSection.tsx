import { type ReactNode } from 'react'

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">{title}</p>
      {children}
    </div>
  )
}
