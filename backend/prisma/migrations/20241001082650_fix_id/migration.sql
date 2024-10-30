/*
  Warnings:

  - The primary key for the `Assy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Casting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Machining` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Assy" DROP CONSTRAINT "Assy_pkey",
ALTER COLUMN "id_assy" SET DATA TYPE TEXT,
ADD CONSTRAINT "Assy_pkey" PRIMARY KEY ("id_assy");

-- AlterTable
ALTER TABLE "Casting" DROP CONSTRAINT "Casting_pkey",
ALTER COLUMN "id_casting" SET DATA TYPE TEXT,
ADD CONSTRAINT "Casting_pkey" PRIMARY KEY ("id_casting");

-- AlterTable
ALTER TABLE "Machining" DROP CONSTRAINT "Machining_pkey",
ALTER COLUMN "id_machining" SET DATA TYPE TEXT,
ADD CONSTRAINT "Machining_pkey" PRIMARY KEY ("id_machining");
