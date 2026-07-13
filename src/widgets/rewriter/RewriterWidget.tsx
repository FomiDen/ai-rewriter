"use client";

import React from "react";
import { GlassCard } from "@/shared/ui/GlassCard";
import { PremiumGate } from "@/features/premium-activation/ui/PremiumGate";
import { RewriteForm } from "@/features/rewrite-form/ui/RewriteForm";
import { usePremium } from "@/features/premium-activation/model/usePremium";

interface RewriterWidgetProps {
  isAdmin: boolean;
}

export const RewriterWidget = ({ isAdmin }: RewriterWidgetProps) => {
  const {
    canGenerate,
    incrementUsage,
    premiumActive,
    remaining,
    activateKey,
    generateKey,
  } = usePremium(isAdmin);

  const handlePay = () => {
    window.open("https://t.me/DeniFom", "_blank");
  };

  return (
    <GlassCard>
      <PremiumGate
        canGenerate={canGenerate}
        remaining={premiumActive ? "∞" : remaining}
        premiumActive={premiumActive}
        isAdmin={isAdmin}
        onPay={handlePay}
        onActivateKey={activateKey}
        onGenerateKey={generateKey}
      />
      <RewriteForm disabled={!canGenerate} onSuccess={incrementUsage} />
    </GlassCard>
  );
};
