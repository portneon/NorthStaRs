/*
  Warnings:

  - You are about to drop the column `createdById` on the `Quiz` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Quiz` DROP FOREIGN KEY `Quiz_createdById_fkey`;

-- DropIndex
DROP INDEX `Quiz_createdById_fkey` ON `Quiz`;

-- AlterTable
ALTER TABLE `Quiz` DROP COLUMN `createdById`;
