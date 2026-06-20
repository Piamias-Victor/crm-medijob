import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'

export async function listPharmacyPickerOptions() {
  return pharmacyRepository.listForPicker()
}
