/*
  Warnings:

  - Added the required column `state` to the `Assy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Casting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Machining` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assy" ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id_assy" DROP DEFAULT;
DROP SEQUENCE "Assy_id_assy_seq";

-- AlterTable
ALTER TABLE "Casting" ADD COLUMN     "state" TEXT NOT NULL,
ALTER COLUMN "id_casting" DROP DEFAULT;
DROP SEQUENCE "Casting_id_casting_seq";

-- AlterTable
ALTER TABLE "Machining" ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id_machining" DROP DEFAULT;
DROP SEQUENCE "Machining_id_machining_seq";

-- CreateTable
CREATE TABLE "TimeSet" (
    "id_timeSet" SERIAL NOT NULL,
    "datenow" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" VARCHAR(255) NOT NULL,
    "triggerDS" INTEGER NOT NULL,
    "triggerNS" INTEGER NOT NULL,
    "generatedId" VARCHAR(255) NOT NULL,

    CONSTRAINT "TimeSet_pkey" PRIMARY KEY ("id_timeSet")
);
