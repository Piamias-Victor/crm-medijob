import { readCommentsOrEmpty } from '@/server/badakan/read-comments'
import type { BadakanComment } from '@/server/badakan/map-comment'
import { badakanCommentsListLabel } from '@/view-models/badakan-comment-list-label'
import { toAppProfileListItem } from '@/view-models/app-profile-list'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type ListRow = Parameters<typeof toAppProfileListItem>[0]

export async function mapIntakeFollowUpWithComments(
  rows: ListRow[],
  getComments: (badakanId: string) => Promise<BadakanComment[]>,
): Promise<AppProfileListItem[]> {
  const labels = await Promise.all(
    rows.map((row) =>
      readCommentsOrEmpty(() => getComments(row.badakanId)).then(badakanCommentsListLabel),
    ),
  )
  return rows.map((row, i) =>
    toAppProfileListItem({ ...row, badakanCommentsLabel: labels[i] }),
  )
}
