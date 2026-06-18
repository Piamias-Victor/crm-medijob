'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { USER_ROLE_OPTIONS } from '@/view-models/user-admin'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function UserRoleSelect({ value, onChange }: Props) {
  return (
    <Combobox
      value={value}
      onChange={onChange}
      options={USER_ROLE_OPTIONS}
      placeholder="Choisir un rôle"
    />
  )
}
