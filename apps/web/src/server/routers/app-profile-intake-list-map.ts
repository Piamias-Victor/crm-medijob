import { toAppProfileListItem } from '@/view-models/app-profile-list'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type ListRow = Parameters<typeof toAppProfileListItem>[0]

/** List mapping without live Badakan HTTP (N+1 killed « Voir tous »). */
export function mapIntakeFollowUpRows(rows: ListRow[]): AppProfileListItem[] {
  return rows.map((row) => toAppProfileListItem(row))
}
