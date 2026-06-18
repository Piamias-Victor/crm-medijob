'use client'

import { Sparkles } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { AssistantChat } from '@/components/organisms/AssistantChat'

export function AssistantPage() {
  return (
    <DashboardPage
      icon={<Sparkles className="size-5" />}
      title="Assistant IA"
      description="Chat contextuel et raccourcis pour le recrutement médical."
    >
      <AssistantChat />
    </DashboardPage>
  )
}
