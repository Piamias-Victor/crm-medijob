import { TRPCError } from '@trpc/server'
import type { ContractType, Prisma } from '@prisma/client'
import {
  geocodeAddressFields,
  type GeoQueryLookup,
} from '@/lib/geo/geocode-address-fields'
import { formatBoardOfferTitle } from '@/server/job-board/format-board-offer'
import { renderOfferSectionsHtml } from '@/server/job-board/render-offer-sections'

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

export function stubStandaloneContent(contractType: string, tempsPlein: boolean) {
  return renderOfferSectionsHtml({
    resume: 'Description à compléter ou à générer.',
    missions: ['À préciser'],
    profil: ['À préciser'],
    infos: [
      `Contrat : ${contractType}`,
      tempsPlein ? 'Temps plein' : 'Temps partiel',
    ],
  })
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
    content: stubStandaloneContent(input.contractType, input.tempsPlein),
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
