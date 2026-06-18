import { cn } from '@/lib/cn'
import { MedicalCross } from '@/components/atoms/MedicalCross'

export function SidebarBrand({ expanded = true }: { expanded?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-2">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-accent-fg">
        <MedicalCross className="size-5" />
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
