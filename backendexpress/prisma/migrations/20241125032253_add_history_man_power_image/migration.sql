-- CreateTable
CREATE TABLE "historyManPowerImage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "noreg" TEXT NOT NULL,
    "shift" "ShitType" NOT NULL DEFAULT 'WHITE',
    "path" TEXT NOT NULL DEFAULT '/default.png',
    "x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "y" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "xPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "yPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historyManPowerImage_pkey" PRIMARY KEY ("id")
);
