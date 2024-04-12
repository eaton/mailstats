CREATE TABLE `address` (
	`aid` text PRIMARY KEY NOT NULL,
	`address` text,
	`name` text,
	`domain` text,
	`labels` text
);
--> statement-breakpoint
CREATE TABLE `attachment` (
	`cid` text PRIMARY KEY NOT NULL,
	`mid` text,
	`contentType` text,
	`bytes` integer,
	`filename` text,
	`checksum` text
);
--> statement-breakpoint
CREATE TABLE `message` (
	`mid` text PRIMARY KEY NOT NULL,
	`messageId` text,
	`inReplyTo` text,
	`date` text,
	`subject` text,
	`sender` text,
	`recipient` text,
	`text` text,
	`html` text,
	`headers` text,
	`labels` text,
	`meta` text
);
--> statement-breakpoint
CREATE TABLE `participant` (
	`mid` text,
	`rel` text,
	`aid` text
);
