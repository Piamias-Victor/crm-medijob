import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  candidateId: string
  className?: string
  children: ReactNode
}

export function CandidateDetailLink({ candidateId, className, children }: Props) {
  return (
    <Link
      href={`/candidats/${candidateId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('hover:text-primary', className)}
    >
      {children}
    </Link>
  )
}
