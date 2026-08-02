export type MapPinSource = {
  id: string
  label: string
  latitude: number | null
  longitude: number | null
}

export type MapPin = {
  id: string
  label: string
  latitude: number
  longitude: number
}

export function toMapPins(rows: MapPinSource[]): MapPin[] {
  return rows.flatMap((row) => {
    if (row.latitude == null || row.longitude == null) return []
    return [
      {
        id: row.id,
        label: row.label,
        latitude: row.latitude,
        longitude: row.longitude,
      },
    ]
  })
}
