'use client'

import { useState } from 'react'
import type { RefItem } from '@/view-models/referential'

export function useCvExtractionJobTitles(
  referentials: RefItem[],
  suggestedJobTitles: RefItem[],
) {
  return useState([
    ...referentials,
    ...suggestedJobTitles.filter(
      (item) => !referentials.some((existing) => existing.id === item.id),
    ),
  ])
}
