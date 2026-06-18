-- AlterTable
ALTER TABLE `PartnerQuote` ADD COLUMN `role` VARCHAR(191) NULL;

-- CreateIndex: one quote per partner
CREATE UNIQUE INDEX `PartnerQuote_partner_key` ON `PartnerQuote`(`partner`);
