/*
  Warnings:

  - You are about to drop the column `deviceType` on the `Session` table. All the data in the column will be lost.
  - Added the required column `expiredAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeviceList" AS ENUM ('MOBILE', 'TABLET', 'DESKTOP', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('BASIC', 'INFO', 'WARNING');

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "deviceType",
ADD COLUMN     "device" "DeviceList" NOT NULL DEFAULT 'MOBILE',
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "DeviceType";

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "TypeNotification" NOT NULL DEFAULT 'BASIC',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
