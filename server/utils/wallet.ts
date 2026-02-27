import { API } from "../config/constants";

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE58_SET = new Set(BASE58_ALPHABET.split(""));

export function isValidSolanaAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;

  if (address.length < API.WALLET_MIN_LENGTH || address.length > API.WALLET_MAX_LENGTH) {
    return false;
  }

  for (const char of address) {
    if (!BASE58_SET.has(char)) return false;
  }

  return true;
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function maskAddress(address: string): string {
  if (!address || address.length < 8) return "****";
  return `${address.slice(0, 4)}${"*".repeat(Math.min(address.length - 8, 32))}${address.slice(-4)}`;
}

export function generateMockMintAddress(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `mint_${timestamp}_${random}`;
}

export function generateMockTxSignature(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let sig = "";
  for (let i = 0; i < 88; i++) {
    sig += chars[Math.floor(Math.random() * chars.length)];
  }
  return sig;
}

export function generateArweaveHash(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `ar_${timestamp}_${random}`;
}
