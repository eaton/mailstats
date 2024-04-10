CREATE TABLE `address` (
	`aid` text,
	`address` text,
	`domain` text,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `attachment` (
	`mid` text,
	`cid` text,
	`contentType` text,
	`bytes` integer,
	`filename` text,
	`checksum` text,
	`headers` text,
	`embeddings` text,
	`meta` text
);
--> statement-breakpoint
CREATE TABLE `label` (
	`lid` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `message` (
	`mid` text PRIMARY KEY NOT NULL,
	`thread` text,
	`embeddings` text,
	`meta` text,
	`headers` text
);
--> statement-breakpoint
CREATE TABLE `messagelabel` (
	`mid` text NOT NULL,
	`lid` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `participant` (
	`mid` text,
	`rel` text,
	`aid` text,
	FOREIGN KEY (`mid`) REFERENCES `message`(`mid`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`aid`) REFERENCES `address`(`aid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `label_name_unique` ON `label` (`name`);