import { AssistantChat } from '@/components/organisms/AssistantChat'

export default function AssistantPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-fg">Assistant IA</h1>
        <p className="text-sm text-fg-muted">
          Chat contextuel et raccourcis pour le recrutement médical.
        </p>
      </header>
      <AssistantChat />
    </div>
  )
}
