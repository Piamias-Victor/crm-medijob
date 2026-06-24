'use client'

import { useEffect, useState } from 'react'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'
import { useAnchoredPanel } from '@/lib/use-anchored-panel'

export function useComboboxPanel(
  open: boolean,
  setOpen: (value: boolean | ((current: boolean) => boolean)) => void,
  onChange: (value: string) => void,
  onCreate?: (label: string) => Promise<ComboboxOption>,
) {
  const [query, setQuery] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)
  const { anchorRef, panelRef, style } = useAnchoredPanel(open)

  useEffect(() => {
    if (!open) setCreateError(null)
  }, [open])

  useEffect(() => {
    setCreateError(null)
  }, [query])

  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (anchorRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, anchorRef, panelRef, setOpen])

  const pick = (next: string) => {
    onChange(next)
    setOpen(false)
    setQuery('')
  }

  const create = async () => {
    if (!onCreate) return
    try {
      const created = await onCreate(query.trim())
      pick(created.value)
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Création impossible.')
    }
  }

  return {
    anchorRef,
    panelRef,
    style,
    query,
    setQuery,
    createError,
    pick,
    create,
  }
}
