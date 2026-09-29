'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { IntakeStatusOption } from '@/view-models/app-intake-combobox-options'

const AppIntakeStatusesContext = createContext<readonly IntakeStatusOption[]>([])

export function AppIntakeStatusesProvider({
  statuses,
  children,
}: {
  statuses: readonly IntakeStatusOption[]
  children: ReactNode
}) {
  return (
    <AppIntakeStatusesContext.Provider value={statuses}>
      {children}
    </AppIntakeStatusesContext.Provider>
  )
}

export function useAppIntakeStatuses() {
  return useContext(AppIntakeStatusesContext)
}
