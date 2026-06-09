-- CreateTable
CREATE TABLE `DailyView` (
    `day` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`day`)
);
