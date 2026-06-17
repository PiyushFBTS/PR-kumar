-- CreateTable
CREATE TABLE `JobPosting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `type` ENUM('JOB', 'INTERNSHIP', 'ARTICLESHIP') NOT NULL DEFAULT 'JOB',
    `description` TEXT NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `JobPosting_published_order_idx`(`published`, `order`),
    PRIMARY KEY (`id`)
);
