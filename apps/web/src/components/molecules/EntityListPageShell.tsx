'use client'

import { type ReactNode } from 'react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { SectionCard } from '@/components/molecules/SectionCard'

type Props = {
  icon: ReactNode
  title: string
  description: string
  sectionTitle: string
  sectionDescription: string
  action?: ReactNode
  children: ReactNode
  modal?: ReactNode
}

export function EntityListPageShell({
  icon,
  title,
  description,
  sectionTitle,
  sectionDescription,
  action,
  children,
  modal,
}: Props) {
  return (
    <DashboardPage icon={icon} title={title} description={description}>
      <SectionCard
        variant="glass"
        title={sectionTitle}
        description={sectionDescription}
        bodyClassName="p-4 sm:p-5"
        actions={action}
      >
        {children}
      </SectionCard>
      {modal}
    </DashboardPage>
  )
}
