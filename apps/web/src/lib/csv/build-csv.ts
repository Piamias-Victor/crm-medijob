export const CSV_SEPARATOR = ';'

function escapeCell(value: string): string {
  const needsQuotes =
    value.includes(CSV_SEPARATOR) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r')

  if (!needsQuotes) return value
  return `"${value.replace(/"/g, '""')}"`
}

function formatRow(row: string[]): string {
  return row.map(escapeCell).join(CSV_SEPARATOR)
}

export function buildCsv(headers: string[], rows: string[][]): string {
  const lines = [formatRow(headers), ...rows.map(formatRow)]
  return `\uFEFF${lines.join('\n')}`
}
