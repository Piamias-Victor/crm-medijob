import { type ReactNode } from 'react'
import { dsSections } from '@/lib/design-system'
import { Section } from '@/components/molecules/design-system/Section'
import { LogoShowcase } from '@/components/molecules/design-system/LogoShowcase'
import { PaletteShowcase } from '@/components/molecules/design-system/PaletteShowcase'
import { TypographyShowcase } from '@/components/molecules/design-system/TypographyShowcase'
import { ButtonsShowcase } from '@/components/molecules/design-system/ButtonsShowcase'
import { BadgesShowcase } from '@/components/molecules/design-system/BadgesShowcase'
import { InputsShowcase } from '@/components/molecules/design-system/InputsShowcase'
import { SidebarShowcase } from '@/components/molecules/design-system/SidebarShowcase'
import { KanbanShowcase } from '@/components/molecules/design-system/KanbanShowcase'
import { CandidateShowcase } from '@/components/molecules/design-system/CandidateShowcase'
import { EmptyStateShowcase } from '@/components/molecules/design-system/EmptyStateShowcase'
import { SkeletonShowcase } from '@/components/molecules/design-system/SkeletonShowcase'
import { ToastShowcase } from '@/components/molecules/design-system/ToastShowcase'
import { EntityTableShowcase } from '@/components/molecules/design-system/EntityTableShowcase'

const nodes: Record<string, ReactNode> = {
  logo: <LogoShowcase />,
  palette: <PaletteShowcase />,
  typographie: <TypographyShowcase />,
  boutons: <ButtonsShowcase />,
  badges: <BadgesShowcase />,
  inputs: <InputsShowcase />,
  sidebar: <SidebarShowcase />,
  kanban: <KanbanShowcase />,
  candidat: <CandidateShowcase />,
  'empty-state': <EmptyStateShowcase />,
  skeleton: <SkeletonShowcase />,
  toast: <ToastShowcase />,
  tableau: <EntityTableShowcase />,
}

export function DesignSystemSections() {
  return (
    <div className="flex-1 space-y-12">
      {dsSections.map((section) => (
        <Section key={section.id} id={section.id} title={section.label}>
          {nodes[section.id]}
        </Section>
      ))}
    </div>
  )
}
