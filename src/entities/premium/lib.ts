// src/entities/premium/lib.ts
import { getFutureDate, isExpired } from "@/shared/lib/dates";

export const PREMIUM_DURATION_DAYS = 30;
export const PREMIUM_KEY_PREFIX = "PREMIUM-";

export function generatePremiumKey(): string {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${PREMIUM_KEY_PREFIX}${randomPart}`;
}

export function createExpirationDate(): string {
  return getFutureDate(PREMIUM_DURATION_DAYS);
}

export function isValidPremiumKey(key: string): boolean {
  return key.startsWith(PREMIUM_KEY_PREFIX) && key.length === 14;
}

export { isExpired };
