'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
import { UserList } from '@/components/organisms/UserList'
import { UserCreateForm } from '@/components/molecules/UserCreateForm'
import { UserEditForm } from '@/components/molecules/UserEditForm'
import { GlassModal } from '@/components/molecules/GlassModal'
import { Button } from '@/components/atoms/Button'
import { useUserAdminMutations } from '@/lib/hooks/use-user-admin-mutations'
import type { UserListItem } from '@/view-models/user-admin'
import type { CreateUserInput, UpdateUserInput } from '@/server/admin/user-schema'

type ModalState =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; user: UserListItem }

export function UsersAdmin({ users }: { users: UserListItem[] }) {
  const [modal, setModal] = useState<ModalState>({ kind: 'closed' })
  const [pendingDelete, setPendingDelete] = useState<UserListItem | null>(null)
  const close = () => setModal({ kind: 'closed' })
  const { create, update, remove } = useUserAdminMutations(close, () => setPendingDelete(null))

  return (
    <>
      <SectionCard
        variant="glass"
        title="Utilisateurs"
        description="Comptes recruteurs et administrateurs MediJob."
        bodyClassName="p-4 sm:p-5"
        actions={
          <Button variant="accent" className="shadow-md shadow-accent/20" onClick={() => setModal({ kind: 'create' })}>
            <Plus className="size-4" />
            Nouvel utilisateur
          </Button>
        }
      >
        <UserList
          users={users}
          onEdit={(user) => setModal({ kind: 'edit', user })}
          onDelete={setPendingDelete}
        />
      </SectionCard>
      <GlassModal open={modal.kind === 'create'} onClose={close} title="Nouvel utilisateur" description="Créez un compte recruteur ou administrateur.">
        <UserCreateForm submitting={create.isPending} onCancel={close} onSubmit={(data: CreateUserInput) => create.mutate(data)} />
      </GlassModal>
      <GlassModal open={modal.kind === 'edit'} onClose={close} title="Modifier l’utilisateur" description="Mettez à jour le profil et les droits d’accès.">
        {modal.kind === 'edit' ? (
          <UserEditForm
            defaultValues={{ id: modal.user.id, name: modal.user.name, role: modal.user.role }}
            submitting={update.isPending}
            onCancel={close}
            onSubmit={(data: UpdateUserInput) => update.mutate(data)}
          />
        ) : null}
      </GlassModal>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate({ id: pendingDelete.id })}
        title="Supprimer cet utilisateur ?"
        description={
          pendingDelete
            ? `Le compte « ${pendingDelete.name} » (${pendingDelete.email}) sera définitivement supprimé.`
            : ''
        }
        loading={remove.isPending}
      />
    </>
  )
}
