CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(160) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `vehicles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `brand` VARCHAR(60) NOT NULL,
    `model` VARCHAR(60) NOT NULL,
    `year` INTEGER NOT NULL,
    `plate` VARCHAR(10) NOT NULL,
    `color` VARCHAR(30) NOT NULL,
    `category` ENUM('ECONOMY', 'HATCH', 'SEDAN', 'SUV', 'PICKUP') NOT NULL,
    `daily_rate` DECIMAL(10, 2) NOT NULL,
    `available` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vehicles_plate_key`(`plate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `rentals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `vehicle_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `expected_return_date` DATETIME(3) NOT NULL,
    `returned_at` DATETIME(3) NULL,
    `daily_rate` DECIMAL(10, 2) NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('ACTIVE', 'FINISHED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `rentals_user_id_idx`(`user_id`),
    INDEX `rentals_vehicle_id_idx`(`vehicle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `rentals` ADD CONSTRAINT `rentals_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `rentals` ADD CONSTRAINT `rentals_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
