'use client'

import { useRouter } from 'next/navigation'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import type { ReferentialActions } from '@/view-models/referential'

export type ReferentialMutationHandlers = {
  onSuccess: () => void
  onError: (error: { message: string }) => void
}

type Procedure<TInput> = {
  useMutation: (opts: ReferentialMutationHandlers) => {
    mutateAsync: (input: TInput) => Promise<unknown>
  }
}

export type ReferentialCrudProcedures = {
  create: Procedure<{ name: string }>
  update: Procedure<{ id: string; name: string }>
  remove: Procedure<{ id: string }>
}

export function useReferentialAdminMutations(
  procedures: ReferentialCrudProcedures,
): ReferentialActions {
  const router = useRouter()
  const mutation = useEntityMutation({ onSuccess: () => router.refresh() })
  const create = procedures.create.useMutation(mutation)
  const update = procedures.update.useMutation(mutation)
  const remove = procedures.remove.useMutation(mutation)

  return {
    onAdd: (name) => create.mutateAsync({ name }).then(() => undefined),
    onRename: (id, name) => update.mutateAsync({ id, name }).then(() => undefined),
    onDelete: (id) => remove.mutateAsync({ id }).then(() => undefined),
  }
}
