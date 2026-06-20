import type { MissionStatus, PharmacyStatus } from '@prisma/client'

export type RichPharmacySeed = {
  id: string
  name: string
  city: string
  postalCode: string
  status: PharmacyStatus
  groupement?: string
  software?: string
}

export type RichContactSeed = {
  id: string
  pharmacyId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'TITULAIRE' | 'ADJOINT' | 'RESPONSABLE_RH'
  isPrimary: boolean
}

export type RichCandidateSeed = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  postalCode: string
  jobTitle: string
  mobilityRadiusKm: number
}

export type RichMissionSeed = {
  id: string
  pharmacyId: string
  contactId: string
  title: string
  status: MissionStatus
  contractType: 'CDI' | 'CDD'
  jobTitle: string
}

export const RICH_PHARMACIES: RichPharmacySeed[] = [
  { id: 'rich-ph-lyon-centre', name: 'Pharmacie Bellecour', city: 'Lyon', postalCode: '69002', status: 'ACTIF', groupement: 'Giphar', software: 'Winpharma' },
  { id: 'rich-ph-lyon-gare', name: 'Grande Pharmacie de la Gare', city: 'Lyon', postalCode: '69003', status: 'ACTIF', groupement: 'Alphega', software: 'LGPI' },
  { id: 'rich-ph-paris-marais', name: 'Pharmacie du Marais', city: 'Paris', postalCode: '75004', status: 'ACTIF', groupement: 'Leadersanté', software: 'Smart Rx' },
  { id: 'rich-ph-marseille-vieux', name: 'Pharmacie du Vieux-Port', city: 'Marseille', postalCode: '13001', status: 'PROSPECT', software: 'Pharmaland' },
  { id: 'rich-ph-toulouse-cap', name: 'Pharmacie Capitole', city: 'Toulouse', postalCode: '31000', status: 'ACTIF', groupement: 'Pharmavie', software: 'Crystal' },
]

export const RICH_CONTACTS: RichContactSeed[] = [
  { id: 'rich-ct-1', pharmacyId: 'rich-ph-lyon-centre', firstName: 'Sophie', lastName: 'Moreau', email: 's.moreau@bellecour-pharma.fr', phone: '04 78 00 10 01', role: 'TITULAIRE', isPrimary: true },
  { id: 'rich-ct-2', pharmacyId: 'rich-ph-lyon-gare', firstName: 'Thomas', lastName: 'Girard', email: 't.girard@gare-pharma.fr', phone: '04 78 00 20 02', role: 'TITULAIRE', isPrimary: true },
  { id: 'rich-ct-3', pharmacyId: 'rich-ph-paris-marais', firstName: 'Isabelle', lastName: 'Renard', email: 'i.renard@marais-pharma.fr', phone: '01 42 00 30 03', role: 'TITULAIRE', isPrimary: true },
  { id: 'rich-ct-4', pharmacyId: 'rich-ph-marseille-vieux', firstName: 'Karim', lastName: 'Benali', email: 'k.benali@vieuxport-pharma.fr', phone: '04 91 00 40 04', role: 'TITULAIRE', isPrimary: true },
  { id: 'rich-ct-5', pharmacyId: 'rich-ph-toulouse-cap', firstName: 'Émilie', lastName: 'Dupuis', email: 'e.dupuis@capitole-pharma.fr', phone: '05 61 00 50 05', role: 'RESPONSABLE_RH', isPrimary: true },
]

export const RICH_CANDIDATES: RichCandidateSeed[] = [
  { id: 'rich-ca-1', firstName: 'Camille', lastName: 'Durand', email: 'camille.durand@email.fr', phone: '06 11 22 33 01', city: 'Lyon', postalCode: '69003', jobTitle: 'Pharmacien', mobilityRadiusKm: 30 },
  { id: 'rich-ca-2', firstName: 'Lucas', lastName: 'Martin', email: 'lucas.martin@email.fr', phone: '06 11 22 33 02', city: 'Villeurbanne', postalCode: '69100', jobTitle: 'Préparateur', mobilityRadiusKm: 25 },
  { id: 'rich-ca-3', firstName: 'Léa', lastName: 'Bernard', email: 'lea.bernard@email.fr', phone: '06 11 22 33 03', city: 'Paris', postalCode: '75011', jobTitle: 'Pharmacien', mobilityRadiusKm: 40 },
  { id: 'rich-ca-4', firstName: 'Hugo', lastName: 'Petit', email: 'hugo.petit@email.fr', phone: '06 11 22 33 04', city: 'Marseille', postalCode: '13008', jobTitle: 'Préparateur', mobilityRadiusKm: 35 },
  { id: 'rich-ca-5', firstName: 'Manon', lastName: 'Roux', email: 'manon.roux@email.fr', phone: '06 11 22 33 05', city: 'Toulouse', postalCode: '31000', jobTitle: 'Pharmacien', mobilityRadiusKm: 30 },
  { id: 'rich-ca-6', firstName: 'Nathan', lastName: 'Faure', email: 'nathan.faure@email.fr', phone: '06 11 22 33 06', city: 'Lyon', postalCode: '69007', jobTitle: 'Étudiant pharma', mobilityRadiusKm: 20 },
  { id: 'rich-ca-7', firstName: 'Chloé', lastName: 'Lambert', email: 'chloe.lambert@email.fr', phone: '06 11 22 33 07', city: 'Nantes', postalCode: '44000', jobTitle: 'Rayoniste', mobilityRadiusKm: 30 },
  { id: 'rich-ca-8', firstName: 'Antoine', lastName: 'Mercier', email: 'antoine.mercier@email.fr', phone: '06 11 22 33 08', city: 'Lyon', postalCode: '69006', jobTitle: 'Pharmacien', mobilityRadiusKm: 45 },
]

export const RICH_MISSIONS: RichMissionSeed[] = [
  { id: 'rich-mi-1', pharmacyId: 'rich-ph-lyon-centre', contactId: 'rich-ct-1', title: 'Pharmacien adjoint CDI', status: 'A_POURVOIR', contractType: 'CDI', jobTitle: 'Pharmacien' },
  { id: 'rich-mi-2', pharmacyId: 'rich-ph-lyon-gare', contactId: 'rich-ct-2', title: 'Préparateur CDD été', status: 'A_POURVOIR', contractType: 'CDD', jobTitle: 'Préparateur' },
  { id: 'rich-mi-3', pharmacyId: 'rich-ph-paris-marais', contactId: 'rich-ct-3', title: 'Pharmacien titulaire de remplacement', status: 'A_POURVOIR', contractType: 'CDI', jobTitle: 'Pharmacien' },
  { id: 'rich-mi-4', pharmacyId: 'rich-ph-toulouse-cap', contactId: 'rich-ct-5', title: 'Adjoint officine', status: 'POURVU', contractType: 'CDI', jobTitle: 'Pharmacien' },
  { id: 'rich-mi-5', pharmacyId: 'rich-ph-marseille-vieux', contactId: 'rich-ct-4', title: 'Préparateur H/F', status: 'A_POURVOIR', contractType: 'CDD', jobTitle: 'Préparateur' },
  { id: 'rich-mi-6', pharmacyId: 'rich-ph-lyon-centre', contactId: 'rich-ct-1', title: 'Stage étudiant pharma', status: 'ANNULEE', contractType: 'CDD', jobTitle: 'Étudiant pharma' },
]
