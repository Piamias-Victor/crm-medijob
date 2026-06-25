export function defaultFieldValuesEqual(left: unknown, right: unknown): boolean {
  if (left instanceof Date && right instanceof Date) return left.getTime() === right.getTime()
  return Object.is(left, right)
}

export function fieldValuesDiffer<T>(
  left: T,
  right: T,
  equals: (left: T, right: T) => boolean = defaultFieldValuesEqual,
): boolean {
  return !equals(left, right)
}
