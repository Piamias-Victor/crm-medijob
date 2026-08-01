import { create } from 'zustand'

type GlobalSearchState = {
  open: boolean
  openPalette: () => void
  closePalette: () => void
  togglePalette: () => void
}

export const useGlobalSearchStore = create<GlobalSearchState>((set) => ({
  open: false,
  openPalette: () => set({ open: true }),
  closePalette: () => set({ open: false }),
  togglePalette: () => set((state) => ({ open: !state.open })),
}))
