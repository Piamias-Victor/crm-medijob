import { CSV_SEPARATOR } from '@/lib/csv/build-csv'

export type ParsedCsv = {
  headers: string[]
  rows: string[][]
}

function parseLine(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
      continue
    }
    if (char === '"') {
      inQuotes = true
      continue
    }
    if (char === CSV_SEPARATOR) {
      cells.push(current)
      current = ''
      continue
    }
    current += char
  }
  cells.push(current)
  return cells
}

export function parseCsv(text: string): ParsedCsv {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n').filter((line) => line.trim().length > 0)
  if (lines.length === 0) return { headers: [], rows: [] }
  const [headerLine, ...dataLines] = lines
  return {
    headers: parseLine(headerLine),
    rows: dataLines.map(parseLine),
  }
}
