import type { Metadata } from 'next'
import { SectionNav } from '@/components/molecules/design-system/SectionNav'
import { DesignSystemSections } from '@/components/organisms/DesignSystemSections'

export const metadata: Metadata = {
  title: 'Design System — Medijob',
  description: 'Charte visuelle Medijob — 12 sections de référence.',
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-fg">Design System</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Charte Medijob — composants de production, 12 sections de référence.
        </p>
      </header>
      <div className="flex gap-10">
        <SectionNav />
        <DesignSystemSections />
      </div>
    </main>
  )
}
