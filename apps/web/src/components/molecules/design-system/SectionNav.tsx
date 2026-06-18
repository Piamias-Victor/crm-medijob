import { dsSections } from '@/lib/design-system'

export function SectionNav() {
  return (
    <nav
      aria-label="Sections de la charte"
      className="sticky top-8 hidden h-fit w-48 shrink-0 flex-col gap-1 lg:flex"
    >
      {dsSections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="rounded-md px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-surface hover:text-fg"
        >
          {section.label}
        </a>
      ))}
    </nav>
  )
}
