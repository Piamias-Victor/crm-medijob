export const ANIMATION_LIST_LIMIT = 20

export function shouldAnimateList(count: number): boolean {
  return count <= ANIMATION_LIST_LIMIT
}
