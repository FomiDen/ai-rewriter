// src/features/premium-activation/model/usePremium.ts
import { useState, useCallback } from "react";
import { storage } from "@/shared/lib/storage";
import { getTodayISO } from "@/shared/lib/dates";
import {
  isValidPremiumKey,
  createExpirationDate,
  isExpired,
  generatePremiumKey,
} from "@/entities/premium/lib";

const DAILY_LIMIT = 1;
const STORAGE_USAGE_KEY = "ai_usage";
const STORAGE_PREMIUM_KEY = "ai_premium";

interface Usage {
  date: string;
  count: number;
}

interface PremiumData {
  key: string | null;
  expiresAt: string | null;
}

function getInitialUsage(): Usage {
  const stored = storage.get<Usage>(STORAGE_USAGE_KEY, { date: "", count: 0 });
  const today = getTodayISO();
  if (stored.date !== today) {
    return { date: today, count: 0 };
  }
  return stored;
}

export function usePremium(isAdmin: boolean) {
  const [usage, setUsage] = useState<Usage>(getInitialUsage);
  const [premium, setPremium] = useState<PremiumData>(() =>
    storage.get<PremiumData>(STORAGE_PREMIUM_KEY, {
      key: null,
      expiresAt: null,
    }),
  );

  const premiumActive =
    isAdmin ||
    (premium.key && premium.expiresAt ? !isExpired(premium.expiresAt) : false);

  const canGenerate = premiumActive || usage.count < DAILY_LIMIT;

  const incrementUsage = useCallback(() => {
    if (!premiumActive) {
      setUsage((prev) => {
        const newCount = prev.count + 1;
        const newUsage = { date: getTodayISO(), count: newCount };
        storage.set(STORAGE_USAGE_KEY, newUsage);
        return newUsage;
      });
    }
  }, [premiumActive]);

  const activateKey = useCallback((key: string) => {
    if (!isValidPremiumKey(key)) return false;
    const newPremium = { key, expiresAt: createExpirationDate() };
    setPremium(newPremium);
    storage.set(STORAGE_PREMIUM_KEY, newPremium);
    return true;
  }, []);

  const generateKey = useCallback(() => {
    return generatePremiumKey();
  }, []);

  return {
    canGenerate,
    incrementUsage,
    premiumActive,
    remaining: premiumActive ? Infinity : DAILY_LIMIT - usage.count,
    activateKey,
    generateKey,
  };
}
