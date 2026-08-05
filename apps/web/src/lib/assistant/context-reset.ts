import type { ContextValue } from './context'

export function contextKey(context: ContextValue): string {
  if (!context.entityType || !context.entityId) return ''
  return `${context.entityType}:${context.entityId}`
}

export function didContextChange(prev: ContextValue, next: ContextValue): boolean {
  return contextKey(prev) !== contextKey(next)
}
