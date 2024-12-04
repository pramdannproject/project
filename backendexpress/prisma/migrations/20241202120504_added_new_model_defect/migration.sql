/*
  Warnings:

  - You are about to drop the column `operator` on the `defectOperatorChild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "defectOperatorChild" DROP COLUMN "operator",
ADD COLUMN     "operatorId" TEXT;

-- CreateTable
CREATE TABLE "operator" (
    "id" TEXT NOT NULL,
    "noReg" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "line" TEXT NOT NULL,
    "process" TEXT NOT NULL,
    "defect" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "operator_noReg_key" ON "operator"("noReg");

-- AddForeignKey
ALTER TABLE "defectOperatorChild" ADD CONSTRAINT "defectOperatorChild_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
