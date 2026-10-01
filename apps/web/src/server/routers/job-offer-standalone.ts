import { TRPCError } from '@trpc/server'
import type { ContractType, Prisma } from '@prisma/client'
import {
  geocodeAddressFields,
  type GeoQueryLookup,
} from '@/lib/geo/geocode-address-fields'
import { formatBoardOfferTitle } from '@/server/job-board/format-board-offer'
import { renderOfferSectionsHtml } from '@/server/job-board/render-offer-sections'
import { buildStandaloneOfferSections } from '@/server/job-board/standalone-offer-sections'

export type StandaloneCreateInput = {
  jobTitleId: string
  jobTitleName: string
  city: string
  postalCode?: string
  contractType: ContractType
  tempsPlein: boolean
  salaireMin?: number | null
  salaireMax?: number | null
}

export type CreateStandaloneDeps = {
  create: (data: Prisma.JobOfferCreateInput) => Promise<{ id: string }>
  lookupGeo: GeoQueryLookup
}

export function stubStandaloneContent(input: {
  jobTitleName: string
  city: string
  postalCode?: string | null
  contractType: string
  tempsPlein: boolean
}) {
  return renderOfferSectionsHtml(buildStandaloneOfferSections(input))
}

export async function handleCreateStandaloneOffer(
  deps: CreateStandaloneDeps,
  input: StandaloneCreateInput,
) {
  const coords = await geocodeAddressFields(
    { address: null, city: input.city, postalCode: input.postalCode ?? null },
    deps.lookupGeo,
  )
  if (!coords) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Ville non géocodable. Vérifiez l’orthographe ou le code postal.',
    })
  }
  const title = formatBoardOfferTitle(input.jobTitleName)
  return deps.create({
    title,
    content: stubStandaloneContent({
      jobTitleName: input.jobTitleName,
      city: input.city,
      postalCode: input.postalCode,
      contractType: input.contractType,
      tempsPlein: input.tempsPlein,
    }),
    status: 'BROUILLON',
    jobTitle: { connect: { id: input.jobTitleId } },
    jobTitleName: input.jobTitleName,
    city: input.city.trim(),
    postalCode: input.postalCode?.trim() || null,
    latitude: coords.latitude,
    longitude: coords.longitude,
    contractType: input.contractType,
    tempsPlein: input.tempsPlein,
    salaireMin: input.salaireMin ?? null,
    salaireMax: input.salaireMax ?? null,
  })
}
