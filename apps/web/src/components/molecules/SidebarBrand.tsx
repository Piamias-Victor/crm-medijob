import { cn } from '@/lib/cn'
import { MedijobLogo } from '@/components/atoms/MedijobLogo'

export function SidebarBrand({ expanded = true }: { expanded?: boolean }) {
  return (
    <div className="relative h-9 w-full shrink-0">
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out',
          expanded ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <MedijobLogo compact decorative={expanded} />
      </div>
      <div
        className={cn(
          'absolute inset-0 flex items-center px-1 transition-opacity duration-300 ease-out',
          expanded ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <MedijobLogo className="h-8 w-auto max-w-full" decorative={!expanded} />
      </div>
    </div>
  )
}
