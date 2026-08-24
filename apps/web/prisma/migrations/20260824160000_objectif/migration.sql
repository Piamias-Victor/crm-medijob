-- CreateTable
CREATE TABLE "Objectif" (
    "id" TEXT NOT NULL,
    "monthlyCaPlacement" DOUBLE PRECISION NOT NULL,
    "monthlyMargePlacement" DOUBLE PRECISION NOT NULL,
    "monthlyCaInterim" DOUBLE PRECISION NOT NULL,
    "monthlyMargeInterim" DOUBLE PRECISION NOT NULL,
    "monthlyRentabilityThreshold" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Objectif_pkey" PRIMARY KEY ("id")
);
