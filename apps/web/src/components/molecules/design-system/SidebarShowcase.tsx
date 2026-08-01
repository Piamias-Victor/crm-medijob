import { navItems } from '@/lib/navigation'
import { SidebarBrand } from '@/components/molecules/SidebarBrand'

export function SidebarShowcase() {
  return (
    <div className="flex w-60 flex-col gap-1 rounded-lg border border-border bg-white p-3">
      <div className="mb-2">
        <SidebarBrand />
      </div>
      {navItems.map((item, index) => {
        const Icon = item.icon
        const active = index === 0
        return (
          <span
            key={item.href}
            className={
              active
                ? 'flex items-center gap-3 rounded-md bg-accent-muted px-3 py-2 text-sm font-medium text-accent-hover'
                : 'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-fg-muted'
            }
          >
            <Icon className="size-5 shrink-0" />
            {item.label}
          </span>
        )
      })}
    </div>
  )
}
