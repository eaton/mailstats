CREATE TABLE `address` (
	`aid` text PRIMARY KEY NOT NULL,
	`address` text,
	`domain` text,
	`name` text,
	`meta` text
);
--> statement-breakpoint
CREATE TABLE `attachment` (
	`cid` text PRIMARY KEY NOT NULL,
	`mid` text,
	`contentType` text,
	`bytes` integer,
	`filename` text,
	`checksum` text,
	`headers` text,
	`meta` text
);
--> statement-breakpoint
CREATE TABLE `message` (
	`mid` text PRIMARY KEY NOT NULL,
	`thread` text,
	`subject` text,
	`recipient` text,
	`sender` text,
	`date` text,
	`headers` text,
	`meta` text
);
--> statement-breakpoint
CREATE TABLE `participant` (
	`mid` text,
	`rel` text,
	`aid` text
);
