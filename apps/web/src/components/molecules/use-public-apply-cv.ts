'use client'

import { useState } from 'react'

export type PublicApplyCvFile = { name: string; base64: string }

export function usePublicApplyCv() {
  const [file, setFile] = useState<PublicApplyCvFile | null>(null)
  const [error, setError] = useState<string | null>(null)

  return {
    file,
    error,
    ensureReady() {
      if (file) {
        setError(null)
        return true
      }
      setError('Le CV est obligatoire')
      return false
    },
    async onFileChange(fileList: FileList | null) {
      const next = fileList?.[0]
      if (!next) return
      const buffer = await next.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ''
      bytes.forEach((b) => {
        binary += String.fromCharCode(b)
      })
      setFile({ name: next.name, base64: btoa(binary) })
      setError(null)
    },
  }
}
