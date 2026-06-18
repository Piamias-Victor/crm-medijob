'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { AdminSectionCard } from '@/components/molecules/AdminSectionCard'
import { UserTable } from '@/components/molecules/UserTable'
import { UserCreateForm } from '@/components/molecules/UserCreateForm'
import { UserEditForm } from '@/components/molecules/UserEditForm'
import { Modal } from '@/components/atoms/Modal'
import { Button } from '@/components/atoms/Button'
import type { UserListItem } from '@/view-models/user-admin'
import type { CreateUserInput, UpdateUserInput } from '@/server/admin/user-schema'

type ModalState =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; user: UserListItem }

export function UsersAdmin({ users }: { users: UserListItem[] }) {
  const router = useRouter()
  const [modal, setModal] = useState<ModalState>({ kind: 'closed' })
  const refresh = () => router.refresh()
  const onError = (e: { message: string }) => window.alert(e.message)
  const close = () => setModal({ kind: 'closed' })

  const create = trpc.admin.user.create.useMutation({ onSuccess: () => { close(); refresh() }, onError })
  const update = trpc.admin.user.update.useMutation({ onSuccess: () => { close(); refresh() }, onError })
  const remove = trpc.admin.user.remove.useMutation({ onSuccess: refresh, onError })

  const onDelete = (id: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    remove.mutate({ id })
  }

  return (
    <>
      <AdminSectionCard
        title="Utilisateurs"
        description="Comptes recruteurs et administrateurs MediJob."
      >
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setModal({ kind: 'create' })}>
            <Plus className="size-4" />
            Nouvel utilisateur
          </Button>
        </div>
        <UserTable
          users={users}
          onEdit={(user) => setModal({ kind: 'edit', user })}
          onDelete={onDelete}
        />
      </AdminSectionCard>
      <Modal
        open={modal.kind === 'create'}
        onClose={close}
        title="Nouvel utilisateur"
      >
        <UserCreateForm
          submitting={create.isPending}
          onCancel={close}
          onSubmit={(data: CreateUserInput) => create.mutate(data)}
        />
      </Modal>
      <Modal
        open={modal.kind === 'edit'}
        onClose={close}
        title="Modifier l’utilisateur"
      >
        {modal.kind === 'edit' ? (
          <UserEditForm
            defaultValues={{
              id: modal.user.id,
              name: modal.user.name,
              role: modal.user.role,
            }}
            submitting={update.isPending}
            onCancel={close}
            onSubmit={(data: UpdateUserInput) => update.mutate(data)}
          />
        ) : null}
      </Modal>
    </>
  )
}
