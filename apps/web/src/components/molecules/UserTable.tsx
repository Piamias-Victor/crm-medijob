'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import {
  formatUserCreatedAt,
  formatUserRole,
  type UserListItem,
} from '@/view-models/user-admin'

type Props = {
  users: UserListItem[]
  onEdit: (user: UserListItem) => void
  onDelete: (id: string) => void
}

export function UserTable({ users, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return <p className="text-sm text-fg-muted">Aucun utilisateur pour l’instant.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-fg-muted">
            <th className="py-2 pr-4 font-medium">Nom</th>
            <th className="py-2 pr-4 font-medium">Email</th>
            <th className="py-2 pr-4 font-medium">Rôle</th>
            <th className="py-2 pr-4 font-medium">Créé le</th>
            <th className="py-2 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id} className="text-fg">
              <td className="py-3 pr-4 font-medium">{user.name}</td>
              <td className="py-3 pr-4 text-fg-muted">{user.email}</td>
              <td className="py-3 pr-4">
                <Badge variant={user.role === 'ADMIN' ? 'accent' : 'default'}>
                  {formatUserRole(user.role)}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-fg-muted">{formatUserCreatedAt(user.createdAt)}</td>
              <td className="py-3">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" aria-label={`Modifier ${user.name}`} onClick={() => onEdit(user)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" aria-label={`Supprimer ${user.name}`} onClick={() => onDelete(user.id)}>
                    <Trash2 className="size-4 text-error" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
