'use client'

import { Users } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import type { UserListItem } from '@/view-models/user-admin'
import { UserListCard } from '@/components/molecules/UserListCard'

type Props = {
  users: UserListItem[]
  onEdit: (user: UserListItem) => void
  onDelete: (user: UserListItem) => void
}

export function UserList({ users, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Aucun utilisateur pour l’instant"
        description="Créez le premier compte recruteur ou administrateur."
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {users.map((user) => (
        <UserListCard key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
