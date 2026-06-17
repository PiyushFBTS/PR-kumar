-- AlterTable
ALTER TABLE `JobPosting` ADD COLUMN `department` VARCHAR(191) NULL;
ALTER TABLE `JobPosting` ADD COLUMN `remote` BOOLEAN NOT NULL DEFAULT false;
