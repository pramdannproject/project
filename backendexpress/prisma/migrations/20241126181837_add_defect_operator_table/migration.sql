-- CreateTable
CREATE TABLE "defectOperatorParrent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "defectOperatorParrent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defectOperatorChild" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "line" TEXT NOT NULL,
    "process" TEXT NOT NULL,
    "defect" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "defectOperatorChild_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "defectOperatorChild" ADD CONSTRAINT "defectOperatorChild_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "defectOperatorParrent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
