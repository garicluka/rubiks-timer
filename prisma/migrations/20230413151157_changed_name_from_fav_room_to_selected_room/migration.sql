/*
  Warnings:

  - You are about to drop the column `favUserId` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[selectedById]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_favUserId_fkey";

-- DropIndex
DROP INDEX "Room_favUserId_key";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "favUserId",
ADD COLUMN     "selectedById" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Room_selectedById_key" ON "Room"("selectedById");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_selectedById_fkey" FOREIGN KEY ("selectedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
