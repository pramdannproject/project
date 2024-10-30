/*
  Warnings:

  - You are about to drop the column `tanggal` on the `Assy` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `Casting` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `Machining` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Assy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Casting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Machining` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assy" DROP COLUMN "tanggal",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Casting" DROP COLUMN "tanggal",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Machining" DROP COLUMN "tanggal",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
