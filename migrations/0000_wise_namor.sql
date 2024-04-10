CREATE TABLE `address` (
	`aid` text PRIMARY KEY NOT NULL,
	`address` text,
	`domain` text,
	`name` text
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
	`embeddings` text,
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
	`labels` text,
	`embeddings` text,
	`meta` text,
	`headers` text
);
--> statement-breakpoint
CREATE TABLE `participant` (
	`mid` text,
	`rel` text,
	`aid` text
);
