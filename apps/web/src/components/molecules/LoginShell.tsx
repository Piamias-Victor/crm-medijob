import { type ReactNode } from 'react'
import { AppAtmosphere } from '@/components/molecules/AppAtmosphere'

type Props = { children: ReactNode }

export function LoginShell({ children }: Props) {
  return (
    <AppAtmosphere className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="relative z-10 w-full max-w-[26rem]">{children}</div>
    </AppAtmosphere>
  )
}
