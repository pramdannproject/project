-- CreateTable
CREATE TABLE "manPowerImage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "noreg" TEXT NOT NULL,
    "path" TEXT NOT NULL DEFAULT '/default.png',
    "x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "y" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manPowerImage_pkey" PRIMARY KEY ("id")
);
