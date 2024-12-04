-- CreateEnum
CREATE TYPE "ShitType" AS ENUM ('WHITE', 'RED');

-- AlterTable
ALTER TABLE "manPowerImage" ADD COLUMN     "shift" "ShitType" NOT NULL DEFAULT 'WHITE';
