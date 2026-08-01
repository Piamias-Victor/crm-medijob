import { cn } from '@/lib/cn'
import { MedijobLogo } from '@/components/atoms/MedijobLogo'

export function SidebarBrand({ expanded = true }: { expanded?: boolean }) {
  return (
    <div className={cn('flex items-center', expanded ? 'px-1' : 'justify-center')}>
      <MedijobLogo compact={!expanded} className={expanded ? 'h-9 w-auto' : undefined} />
    </div>
  )
}
