'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { AppIntakeExitCell } from '@/components/molecules/AppIntakeExitCell'
import {
  appIntakeCandidateHref,
  buildCvthequeReturnPath,
} from '@/lib/cvtheque-candidate-href'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

export function AppIntakeActionsCell({ row }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const returnPath = useMemo(
    () => buildCvthequeReturnPath(pathname, searchParams.toString()),
    [pathname, searchParams],
  )
  const href = appIntakeCandidateHref(row.candidateId, returnPath)

  return (
    <div className="flex items-center gap-1" data-row-click-ignore>
      {href ? (
        <Link
          href={href}
          className="px-2 py-1 text-xs font-medium text-accent-hover underline-offset-2 hover:underline"
        >
          Fiche
        </Link>
      ) : null}
      <AppIntakeExitCell row={row} />
    </div>
  )
}
