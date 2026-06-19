'use client'

import { useRouter } from 'next/navigation'
import type { PharmacyTab } from '@/view-models/pharmacy-tabs'
import { PHARMACY_TAB_META } from '@/view-models/pharmacy-tab-meta'
import { Button } from '@/components/atoms/Button'
import { SectionCard } from '@/components/molecules/SectionCard'
import {
  PharmacyDetailTabContent,
  type PharmacyDetailTabContentProps,
} from '@/components/molecules/PharmacyDetailTabContent'

type Props = PharmacyDetailTabContentProps & { tab: PharmacyTab }

export function PharmacyDetailTabPanel(props: Props) {
  const router = useRouter()
  const meta = PHARMACY_TAB_META[props.tab]

  return (
    <SectionCard
      variant="glass"
      title={meta.title}
      description={meta.description}
      bodyClassName="p-5 sm:p-6"
      actions={
        props.tab === 'contacts' ? (
          <Button variant="ghost" onClick={() => router.push('/contacts')}>
            Voir tous les contacts
          </Button>
        ) : null
      }
    >
      <PharmacyDetailTabContent {...props} />
    </SectionCard>
  )
}
