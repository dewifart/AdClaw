import { createHash, randomBytes } from "crypto";

export function sha256(input: string): string {
  return createHash("sha256").update(input, "utf-8").digest("hex");
}

export function contentHash(soulContent: string, memoryContent: string): string {
  const combined = `${soulContent}\n---\n${memoryContent}`;
  return sha256(combined);
}

export function generateIdempotencyKey(): string {
  return randomBytes(16).toString("hex");
}

export function generateEventId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString("hex");
  return `evt_${timestamp}_${random}`;
}

export function verifyContentIntegrity(
  soulContent: string,
  memoryContent: string,
  expectedHash: string
): boolean {
  const computed = contentHash(soulContent, memoryContent);
  return computed === expectedHash;
}

export function deterministicId(input: string): string {
  return sha256(input).slice(0, 32);
}

export function hashWalletForPrivacy(wallet: string): string {
  return sha256(`adclaw:wallet:${wallet}`).slice(0, 16);
}
