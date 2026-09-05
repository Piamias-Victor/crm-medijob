export function interimCountLabel(count: number, noun: string): string {
  return `${count} ${noun}${count > 1 ? 's' : ''}`
}
