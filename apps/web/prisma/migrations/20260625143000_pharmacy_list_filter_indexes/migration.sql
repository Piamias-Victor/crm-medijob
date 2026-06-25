-- Indexes for pharmacy list filters (#158).
CREATE INDEX "Pharmacy_status_idx" ON "Pharmacy"("status");
CREATE INDEX "Pharmacy_softwareId_idx" ON "Pharmacy"("softwareId");
CREATE INDEX "Pharmacy_postalCode_idx" ON "Pharmacy"("postalCode");
