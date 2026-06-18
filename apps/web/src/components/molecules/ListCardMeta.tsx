import { Children, type ReactNode } from 'react'

export function ListCardMeta({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(Boolean)
  if (items.length === 0) return null

  return <div className="flex flex-wrap gap-1.5">{items}</div>
}
