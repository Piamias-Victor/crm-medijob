export type PharmacyMergeErrorCode = 'NOT_FOUND' | 'SAME_ID'

export class PharmacyMergeError extends Error {
  constructor(public code: PharmacyMergeErrorCode) {
    super(code)
    this.name = 'PharmacyMergeError'
  }
}

type MergeTx = {
  pharmacy: {
    findFirst: (args: { where: { id: string } }) => Promise<{ id: string } | null>
  }
}

export async function assertMergePharmaciesValid(
  tx: MergeTx,
  keptId: string,
  absorbedId?: string,
) {
  if (absorbedId && keptId === absorbedId) throw new PharmacyMergeError('SAME_ID')
  const kept = await tx.pharmacy.findFirst({ where: { id: keptId } })
  if (!kept) throw new PharmacyMergeError('NOT_FOUND')
  if (!absorbedId) return
  const absorbed = await tx.pharmacy.findFirst({ where: { id: absorbedId } })
  if (!absorbed) throw new PharmacyMergeError('NOT_FOUND')
}
