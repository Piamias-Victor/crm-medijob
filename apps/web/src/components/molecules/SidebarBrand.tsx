import { cn } from '@/lib/cn'

export function SidebarBrand({ expanded = true }: { expanded?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-2">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-accent-fg">
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
          <path d="M10 2h4v6h6v4h-6v6h-4v-6H4V8h6z" />
        </svg>
      </span>
      <span
        aria-hidden={!expanded}
        className={cn(
          'overflow-hidden whitespace-nowrap text-lg font-bold tracking-tight transition-[max-width,opacity] duration-200 ease-out',
          expanded ? 'max-w-32 opacity-100' : 'max-w-0 opacity-0',
        )}
      >
        MEDIJOB
      </span>
    </div>
  )
}
