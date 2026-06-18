'use client'

import type { UserListItem } from '@/view-models/user-admin'
import { UserListCard } from '@/components/molecules/UserListCard'

type Props = {
  users: UserListItem[]
  onEdit: (user: UserListItem) => void
  onDelete: (user: UserListItem) => void
}

export function UserList({ users, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return <p className="text-sm text-fg-muted">Aucun utilisateur pour l’instant.</p>
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {users.map((user) => (
        <UserListCard key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
