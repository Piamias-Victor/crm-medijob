import { type ReactNode } from 'react'

type Props = {
  media: ReactNode
  title: string
  subtitle?: string
  trailing?: ReactNode
}

export function ListCardHeader({ media, title, subtitle, trailing }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      {media}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight text-fg">{title}</p>
        {subtitle ? <p className="mt-0.5 truncate text-xs text-fg-muted">{subtitle}</p> : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  )
}
