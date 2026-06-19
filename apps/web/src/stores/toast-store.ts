import { create } from 'zustand'

export type ToastVariant = 'success' | 'warning' | 'error'

export type ToastItem = {
  id: string
  variant: ToastVariant
  message: string
}

type ToastState = {
  toasts: ToastItem[]
  push: (toast: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
}

let counter = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: `toast-${++counter}` }],
    })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
