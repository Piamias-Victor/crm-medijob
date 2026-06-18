'use client'

import { useForm, type FieldValues, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema, type CreateUserInput } from '@/server/admin/user-schema'
import { UserFormFields } from '@/components/molecules/UserFormFields'
import { Button } from '@/components/atoms/Button'

type Props = {
  submitting: boolean
  onSubmit: (data: CreateUserInput) => void
  onCancel: () => void
}

export function UserCreateForm({ submitting, onSubmit, onCancel }: Props) {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'RECRUTEUR', name: '', email: '', password: '' },
  })
  const register = form.register as unknown as UseFormRegister<FieldValues>

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <UserFormFields
        register={register}
        errors={form.formState.errors}
        showEmail
        passwordRequired
        role={form.watch('role')}
        onRoleChange={(value) => form.setValue('role', value as CreateUserInput['role'])}
      />
      <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="accent" disabled={submitting} className="shadow-md shadow-accent/20">
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
