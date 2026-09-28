'use client'

import { createContext, useContext } from 'react'
import type { ListIntakeFollowUpInput } from '@/view-models/app-profile-intake-list.schema'

export type AppIntakeListKey = {
  referentScope: NonNullable<ListIntakeFollowUpInput['referentScope']>
  population: NonNullable<ListIntakeFollowUpInput['population']>
}

const AppIntakeListKeyContext = createContext<AppIntakeListKey>({
  referentScope: 'mine',
  population: 'default',
})

export const AppIntakeListKeyProvider = AppIntakeListKeyContext.Provider

export function useAppIntakeListKey() {
  return useContext(AppIntakeListKeyContext)
}
