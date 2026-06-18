'use client'

import { useForm, type FieldValues, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateUserSchema,
  type UpdateUserInput,
} from '@/server/admin/user-schema'
import { UserFormFields } from '@/components/molecules/UserFormFields'
import { Button } from '@/components/atoms/Button'

type Props = {
  defaultValues: UpdateUserInput
  submitting: boolean
  onSubmit: (data: UpdateUserInput) => void
  onCancel: () => void
}

export function UserEditForm({ defaultValues, submitting, onSubmit, onCancel }: Props) {
  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { ...defaultValues, password: '' },
  })
  const register = form.register as unknown as UseFormRegister<FieldValues>

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <UserFormFields
        register={register}
        errors={form.formState.errors}
        passwordRequired={false}
        role={form.watch('role')}
        onRoleChange={(value) => form.setValue('role', value as UpdateUserInput['role'])}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
