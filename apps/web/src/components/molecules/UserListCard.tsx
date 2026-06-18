'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardMeta } from '@/components/molecules/ListCardMeta'
import { ListCardChip } from '@/components/molecules/ListCardChip'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import {
  formatUserCreatedAt,
  formatUserRole,
  type UserListItem,
} from '@/view-models/user-admin'

type Props = {
  user: UserListItem
  onEdit: (user: UserListItem) => void
  onDelete: (user: UserListItem) => void
}

export function UserListCard({ user, onEdit, onDelete }: Props) {
  return (
    <ListCardShell>
      <ListCardHeader
        media={<Avatar name={user.name} className={`${LIST_CARD_MEDIA_CLASS} rounded-lg`} />}
        title={user.name}
        subtitle={user.email}
        trailing={
          <Badge variant={user.role === 'ADMIN' ? 'accent' : 'default'} className="text-[11px]">
            {formatUserRole(user.role)}
          </Badge>
        }
      />
      <ListCardMeta>
        <ListCardChip>{formatUserCreatedAt(user.createdAt)}</ListCardChip>
      </ListCardMeta>
      <div className="flex justify-end gap-1 border-t border-border/40 pt-2">
        <Button variant="ghost" className="px-2" aria-label={`Modifier ${user.name}`} onClick={() => onEdit(user)}>
          <Pencil className="size-4" />
        </Button>
        <Button variant="ghost" className="px-2" aria-label={`Supprimer ${user.name}`} onClick={() => onDelete(user)}>
          <Trash2 className="size-4 text-error" />
        </Button>
      </div>
    </ListCardShell>
  )
}
