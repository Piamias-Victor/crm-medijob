import { cn } from '@/lib/cn'
import { MedicalCross } from '@/components/atoms/MedicalCross'

export function SidebarBrand({ expanded = true }: { expanded?: boolean }) {
  return (
    <div className={cn('flex items-center', expanded ? 'gap-2 px-2' : 'justify-center px-0')}>
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-accent-fg">
        <MedicalCross className="size-5" />
      </span>
      {expanded ? <span className="truncate text-lg font-bold tracking-tight">MEDIJOB</span> : null}
    </div>
  )
}
