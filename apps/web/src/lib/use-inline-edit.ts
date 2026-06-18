'use client'

import { useState } from 'react'

export function useInlineEdit(initial: string, onSave: (value: string) => void | Promise<void>) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initial)

  const save = async () => {
    const next = value.trim()
    if (next && next !== initial) await onSave(next)
    setEditing(false)
  }

  return { editing, setEditing, value, setValue, save }
}
