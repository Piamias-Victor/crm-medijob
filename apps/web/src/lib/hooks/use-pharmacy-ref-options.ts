'use client'

import { useState } from 'react'

type Ref = { id: string; name: string }

export function usePharmacyRefOptions(groupements: Ref[], softwares: Ref[]) {
  const [groupementOptions, setGroupementOptions] = useState(groupements)
  const [softwareOptions, setSoftwareOptions] = useState(softwares)
  const addRef =
    (setter: typeof setGroupementOptions, fn: (name: string) => Promise<Ref>) =>
    async (name: string) => {
      const ref = await fn(name)
      setter((prev) => [...prev, ref])
      return { value: ref.id, label: ref.name }
    }

  return {
    groupementOptions,
    softwareOptions,
    addGroupement: (fn: (name: string) => Promise<Ref>) => addRef(setGroupementOptions, fn),
    addSoftware: (fn: (name: string) => Promise<Ref>) => addRef(setSoftwareOptions, fn),
  }
}
