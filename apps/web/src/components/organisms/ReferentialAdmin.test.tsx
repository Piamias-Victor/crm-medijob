import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { ReferentialAdmin } from '@/components/organisms/ReferentialAdmin'
import { useToastStore } from '@/stores/toast-store'
import type {
  ReferentialCrudProcedures,
  ReferentialMutationHandlers,
} from '@/lib/hooks/use-referential-admin-mutations'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

function procedure<TInput>(impl: (input: TInput) => Promise<unknown>) {
  return {
    useMutation: (opts: ReferentialMutationHandlers) => ({
      mutateAsync: async (input: TInput) => {
        try {
          return await impl(input)
        } catch (error) {
          opts.onError(error as { message: string })
          throw error
        }
      },
    }),
  }
}

function makeProcedures(overrides: {
  createAsync?: (input: { name: string }) => Promise<unknown>
  removeAsync?: (input: { id: string }) => Promise<unknown>
}): ReferentialCrudProcedures {
  return {
    create: procedure<{ name: string }>(overrides.createAsync ?? (async () => undefined)),
    update: procedure<{ id: string; name: string }>(async () => undefined),
    remove: procedure<{ id: string }>(overrides.removeAsync ?? (async () => undefined)),
  }
}

describe('ReferentialAdmin', () => {
  beforeEach(() => useToastStore.setState({ toasts: [] }))

  it('creates an item through the shared admin shell', async () => {
    const createAsync = vi.fn().mockResolvedValue(undefined)
    render(
      <ReferentialAdmin
        title="Logiciels"
        description="LGO"
        itemLabel="logiciel"
        items={[]}
        procedures={makeProcedures({ createAsync })}
      />,
    )

    fireEvent.change(screen.getByLabelText('Nouveau logiciel'), { target: { value: 'Winpharma' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }))

    await waitFor(() => expect(createAsync).toHaveBeenCalledWith({ name: 'Winpharma' }))
  })

  it('shows an error toast when delete fails', async () => {
    const removeAsync = vi.fn().mockRejectedValue({ message: 'Déjà utilisé' })
    render(
      <ReferentialAdmin
        title="Logiciels"
        description="LGO"
        itemLabel="logiciel"
        items={[{ id: '1', name: 'Winpharma' }]}
        procedures={makeProcedures({ removeAsync })}
      />,
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Supprimer' })[0])
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {
      expect(useToastStore.getState().toasts[0]?.message).toBe('Déjà utilisé')
    })
  })
})
