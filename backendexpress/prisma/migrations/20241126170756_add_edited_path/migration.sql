-- AlterTable
ALTER TABLE "historyManPowerImage" ADD COLUMN     "editedPath" TEXT NOT NULL DEFAULT '/default.png';

-- AlterTable
ALTER TABLE "manPowerImage" ADD COLUMN     "editedPath" TEXT NOT NULL DEFAULT '/default.png';
