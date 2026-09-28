'use client'

import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import { buildAppIntakeIdentityColumns } from './app-intake-identity-columns'
import { buildAppIntakeOpsColumns } from './app-intake-ops-columns'

type Ref = { id: string; name: string }

export function buildAppIntakeFollowUpColumns(
  recruiters: readonly Ref[] = [],
): ColumnDef<AppProfileListItem>[] {
  return [...buildAppIntakeIdentityColumns(), ...buildAppIntakeOpsColumns(recruiters)]
}
