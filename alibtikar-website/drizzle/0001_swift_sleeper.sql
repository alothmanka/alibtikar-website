CREATE TABLE `site_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentKey` varchar(128) NOT NULL,
	`valueEn` text NOT NULL,
	`valueAr` text NOT NULL,
	`category` varchar(64) NOT NULL,
	`label` varchar(256) NOT NULL,
	`fieldType` varchar(32) NOT NULL DEFAULT 'text',
	`sortOrder` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_content_contentKey_unique` UNIQUE(`contentKey`)
);
