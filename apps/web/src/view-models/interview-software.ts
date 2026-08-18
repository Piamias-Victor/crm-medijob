import { SOFTWARES } from '../../prisma/seed-data'

export const INTERVIEW_SOFTWARE_OPTIONS = SOFTWARES.map((name) => ({
  value: name,
  label: name,
}))
