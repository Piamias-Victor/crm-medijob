import { type ReactNode } from 'react'
import { InterimLayoutShell } from '@/components/organisms/InterimLayoutShell'

export default function InterimLayout({ children }: { children: ReactNode }) {
  return <InterimLayoutShell>{children}</InterimLayoutShell>
}
