'use client'

import { useEffect } from 'react'
import { useGlobalSearchStore } from '@/stores/global-search-store'

export function useGlobalSearchHotkey() {
  const togglePalette = useGlobalSearchStore((s) => s.togglePalette)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        togglePalette()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [togglePalette])
}
