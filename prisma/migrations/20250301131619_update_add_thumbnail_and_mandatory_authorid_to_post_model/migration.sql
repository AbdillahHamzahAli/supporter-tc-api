/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Made the column `authorId` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_authorId_fkey`;

-- DropIndex
DROP INDEX `posts_authorId_fkey` ON `posts`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `slug` VARCHAR(255) NOT NULL,
    ADD COLUMN `thumbnail` VARCHAR(255) NULL,
    MODIFY `authorId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `posts_slug_key` ON `posts`(`slug`);

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
