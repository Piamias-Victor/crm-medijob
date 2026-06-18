'use client'

import type { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/atoms/Input'
import { PasswordInput } from '@/components/molecules/PasswordInput'
import { FormField } from '@/components/molecules/FormField'
import { FormSection } from '@/components/molecules/FormSection'
import { UserRoleSelect } from '@/components/molecules/UserRoleSelect'

const fieldClass = 'h-11 rounded-lg bg-white/80'

type Props = {
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  showEmail?: boolean
  passwordRequired: boolean
  role: string
  onRoleChange: (value: string) => void
}

export function UserFormFields({
  register,
  errors,
  showEmail = false,
  passwordRequired,
  role,
  onRoleChange,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <FormSection title="Identité">
        <div className="flex flex-col gap-4">
          <FormField label="Nom" error={errors.name?.message as string | undefined}>
            <Input id="name" autoComplete="name" className={fieldClass} {...register('name')} />
          </FormField>
          {showEmail ? (
            <FormField label="Email" error={errors.email?.message as string | undefined}>
              <Input id="email" type="email" autoComplete="email" className={fieldClass} {...register('email')} />
            </FormField>
          ) : null}
        </div>
      </FormSection>
      <FormSection title="Accès">
        <div className="flex flex-col gap-4">
          <FormField
            label={passwordRequired ? 'Mot de passe' : 'Nouveau mot de passe (optionnel)'}
            error={errors.password?.message as string | undefined}
          >
            <PasswordInput
              id="password"
              autoComplete={passwordRequired ? 'new-password' : 'off'}
              placeholder={passwordRequired ? undefined : 'Laisser vide pour conserver'}
              className={fieldClass}
              {...register('password')}
            />
          </FormField>
          <FormField label="Rôle" error={errors.role?.message as string | undefined}>
            <UserRoleSelect value={role} onChange={onRoleChange} />
          </FormField>
        </div>
      </FormSection>
    </div>
  )
}
