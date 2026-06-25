'use client'

import { ContactFormModal } from '@/components/molecules/ContactFormModal'
import { MissionFormModal } from '@/components/molecules/MissionFormModal'
import { QuickCreateLoading } from '@/components/molecules/QuickCreateLoading'
import type { HomeQuickCreateState } from '@/lib/hooks/use-home-quick-create'

type Props = { state: HomeQuickCreateState }

export function HomeQuickCreateModals({ state }: Props) {
  const { open, setOpen, refs, refsLoading } = state

  if (open && refsLoading) {
    return <QuickCreateLoading onClose={() => setOpen(null)} />
  }

  return (
    <>
      <MissionFormModal
        open={open === 'mission'}
        pharmacies={refs.pharmacies}
        jobTitles={refs.jobTitles}
        recruiters={refs.recruiters}
        submitting={state.createMission.isPending}
        errorMessage={state.createMission.error?.message}
        onClose={() => setOpen(null)}
        onSubmit={(data) => state.createMission.mutate(data)}
        onCreateJobTitle={(name) => state.newJobTitle.mutateAsync({ name })}
      />
      <ContactFormModal
        open={open === 'contact'}
        pharmacies={refs.pharmacies}
        submitting={state.createContact.isPending}
        errorMessage={state.createContact.error?.message}
        onClose={() => setOpen(null)}
        onSubmit={(data) => state.createContact.mutate(data)}
      />
    </>
  )
}
