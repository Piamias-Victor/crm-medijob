import type { MissionStatus, Prisma, PrismaClient } from '@prisma/client'
import { decideEventStamp, POURVU_TARGETS } from '@/view-models/activite-event-stamp'

type TerminalStageUpdate = { candidateId: string; stageId: string }
type Tx = Prisma.TransactionClient

export async function applyMissionTerminalTransition(
  db: PrismaClient,
  missionId: string,
  status: MissionStatus,
  stageUpdates: TerminalStageUpdate[],
  now: Date = new Date(),
) {
  return db.$transaction(async (tx: Tx) => {
    const current = await tx.mission.findUnique({
      where: { id: missionId },
      select: { status: true, pourvuAt: true },
    })
    const pourvuAt = decideEventStamp({
      previous: current?.status,
      next: status,
      targets: POURVU_TARGETS,
      existing: current?.pourvuAt,
      now,
    })
    const result = await tx.mission.update({
      where: { id: missionId },
      data: { status, pourvuAt },
      select: { id: true, status: true, pourvuAt: true },
    })
    for (const update of stageUpdates) {
      await tx.missionCandidate.update({
        where: {
          missionId_candidateId: { missionId, candidateId: update.candidateId },
        },
        data: { stageId: update.stageId },
      })
    }
    return result
  })
}
