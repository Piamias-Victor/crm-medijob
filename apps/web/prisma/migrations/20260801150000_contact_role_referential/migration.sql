-- Rename enum so table can reuse ContactRole name
ALTER TYPE "ContactRole" RENAME TO "ContactRole_old";

-- CreateTable ContactRole referential
CREATE TABLE "ContactRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactRole_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ContactRole_name_key" ON "ContactRole"("name");

-- Seed default roles (CSV V1-026) before migrating FK
INSERT INTO "ContactRole" ("id", "name") VALUES
  ('seed-contact-role-titulaire', 'Titulaire'),
  ('seed-contact-role-adjoint', 'Pharmacien adjoint'),
  ('seed-contact-role-prep-ref', 'Préparateur référent'),
  ('seed-contact-role-rh', 'Responsable RH'),
  ('seed-contact-role-compta', 'Comptabilité'),
  ('seed-contact-role-autre', 'Autre');

-- Replace enum column with FK
ALTER TABLE "Contact" ADD COLUMN "contactRoleId" TEXT;

UPDATE "Contact" SET "contactRoleId" = CASE "role"::text
  WHEN 'TITULAIRE' THEN 'seed-contact-role-titulaire'
  WHEN 'ADJOINT' THEN 'seed-contact-role-adjoint'
  WHEN 'PREPARATEUR_REFERENT' THEN 'seed-contact-role-prep-ref'
  WHEN 'RESPONSABLE_RH' THEN 'seed-contact-role-rh'
  ELSE 'seed-contact-role-autre'
END;

ALTER TABLE "Contact" ALTER COLUMN "contactRoleId" SET NOT NULL;
ALTER TABLE "Contact" DROP COLUMN "role";
DROP TYPE "ContactRole_old";

CREATE INDEX "Contact_contactRoleId_idx" ON "Contact"("contactRoleId");
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_contactRoleId_fkey"
  FOREIGN KEY ("contactRoleId") REFERENCES "ContactRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
