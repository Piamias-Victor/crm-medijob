import { MedijobLogo } from '@/components/atoms/MedijobLogo'

export function LogoShowcase() {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-1 items-center justify-center rounded-md border border-border bg-white p-8">
        <MedijobLogo className="h-12 w-auto" />
      </div>
      <div className="flex flex-1 items-center justify-center rounded-md bg-primary p-8">
        <MedijobLogo className="h-12 w-auto" />
      </div>
    </div>
  )
}
