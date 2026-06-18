import { MedicalCross } from '@/components/atoms/MedicalCross'

function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-fg">
        <MedicalCross className="size-5" />
      </span>
      <span
        className={onDark ? 'text-xl font-bold tracking-tight text-primary-fg' : 'text-xl font-bold tracking-tight text-fg'}
      >
        MEDIJOB
      </span>
    </div>
  )
}

export function LogoShowcase() {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-1 items-center justify-center rounded-md border border-border bg-white p-8">
        <Logo />
      </div>
      <div className="flex flex-1 items-center justify-center rounded-md bg-primary p-8">
        <Logo onDark />
      </div>
    </div>
  )
}
