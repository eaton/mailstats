export type MboxMessage = {
  mid: string,
  messageId?: string,
  inReplyTo?: string,
  date?: Date,
  subject?: string,
  sender?: string,
  recipient?: string,
  headers?: Record<string, unknown>,
  text?: string,
  html?: string,
  labels: string[],
  meta: Record<string, unknown>,
  participants: Record<string, MboxAddress[]>,
  attachments: MboxAttachment[],
};

export type MboxAddress = {
  aid: string,
  name: string,
  address?: string,
  domain?: string,
  labels: string[]
};

export type MboxAttachment = {
  cid: string,
  mid: string,
  bytes: number,
  contentType: string,
  filename: string,
  checksum: string,
  content: Buffer,
  headers?: Record<string, unknown>,
  meta: Record<string, unknown>,
};
