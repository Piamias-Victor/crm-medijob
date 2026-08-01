import { cn } from '@/lib/cn'
import { MedijobLogo } from '@/components/atoms/MedijobLogo'

export function SidebarBrand({ expanded = true }: { expanded?: boolean }) {
  return (
    <div
      className={cn(
        'flex h-9 shrink-0 items-center overflow-hidden',
        expanded ? 'px-1' : 'justify-center',
      )}
    >
      {expanded ? (
        <MedijobLogo className="h-8 w-auto max-w-full" />
      ) : (
        <MedijobLogo compact />
      )}
    </div>
  )
}
